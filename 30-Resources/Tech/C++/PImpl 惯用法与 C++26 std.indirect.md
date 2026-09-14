---
type: source-note
aliases:
  - The PImpl idiom and the C++26 std::indirect type
source: "https://mariusbancila.ro/blog/2026/07/23/the-pimpl-idiom-and-the-cpp26-stdindirect-type/"
author: Marius Bancila
published: 2026-07-24
created: 2026-07-24
tags:
  - type/source-note
  - topic/cpp
  - topic/pimpl
---

# PImpl 惯用法与 C++26 std::indirect

相关：[[AI 与 Coding]]

> PImpl 用不透明指针把实现细节移出头文件；C++26 的 `std::indirect` 保留堆分配的同时提供更接近普通值的复制与 const 语义。

## 核心概念

### PImpl（Pointer to Implementation）

PImpl 在公开类中只前置声明实现类型 `Impl`，并保存一个指向它的成员；`Impl` 的完整定义和实际数据则放在 `.cpp` 文件。这样使用 `Widget` 的代码只需依赖稳定的接口，而不必因实现成员变化重新看到全部细节。

`Impl` 在头文件中属于**不完整类型**：编译器知道它是一个类型，却不知道它的大小和析构方式。因此，涉及销毁 `Impl` 的操作需要在 `.cpp` 中、`Impl` 已完整定义后实现或默认化。

### 特殊成员函数与值语义

当类直接管理裸指针时，需要自己处理析构、复制构造、复制赋值、移动构造和移动赋值（Rule of Five）：

- 复制不能只复制地址，否则两个对象会共同释放同一块内存；应深拷贝 `Impl`。
- 移动会转移指针并令源对象的指针变为 `nullptr`；之后解引用源对象会产生未定义行为。
- 移动操作标为 `noexcept`，容器（如 `std::vector`）扩容时才更倾向于移动元素而非为了强异常保证退回复制。

## 三种实现方式

### 裸指针：控制最直接，维护成本最高

`Impl* pimpl_` 能完整表达 PImpl，但资源释放、深拷贝与移动后的空指针状态都要手写。它适合说明机制，不适合作为通常的默认选择。

### `std::unique_ptr`：自动释放，但复制仍需设计

`std::unique_ptr<Impl>` 自动管理生命周期，析构、移动构造和移动赋值通常可在 `.cpp` 中 `= default`。但它本身不可复制，因此要保留值语义仍需手写深拷贝构造和复制赋值。

此外，`const std::unique_ptr<Impl>` 仍可取得可修改的 `Impl`，因此 const 不会自动传递到实现对象；移动后的对象也会持有空指针。

### `std::indirect`：为“堆上对象，但像值一样使用”设计

C++26 的 `std::indirect<T>` 位于 `<memory>`，拥有一个堆分配的 `T`，却更接近普通成员变量的行为：

- **深拷贝**：复制 `std::indirect<T>` 会复制它持有的 `T`，因此外层类的复制操作可默认化。
- **const 传播**：通过 `const std::indirect<T>` 只能获得对 `T` 的 const 访问。
- **通常非空**：除移动后的状态外始终有值；可用 `valueless_after_move()` 显式检查移动后的状态。

它并不能消除不完整类型带来的约束：特殊成员函数仍应在头文件声明、在 `.cpp`（`Impl` 完整处）默认化。

## 代码与例子

`std::indirect` 版本的头文件只暴露接口和前置声明：

```cpp
#pragma once
#include <memory>
#include <string>

class Widget {
public:
    Widget(const std::string& name);
    Widget(const Widget&);
    Widget(Widget&&) noexcept;
    Widget& operator=(const Widget&);
    Widget& operator=(Widget&&) noexcept;
    ~Widget();

    void click();
    int clickCount() const;
    std::string label() const;

private:
    struct Impl;
    std::indirect<Impl> pimpl_;
};
```

在 `.cpp` 中定义 `Impl` 后，构造实现对象，并让编译器在类型完整处生成特殊成员函数：

```cpp
struct Widget::Impl {
    std::string name;
    int clicks = 0;
    explicit Impl(std::string n) : name(std::move(n)) {}
};

Widget::Widget(const std::string& name) : pimpl_(std::in_place, name) {}
Widget::Widget(const Widget&) = default;
Widget::Widget(Widget&&) noexcept = default;
Widget& Widget::operator=(const Widget&) = default;
Widget& Widget::operator=(Widget&&) noexcept = default;
Widget::~Widget() = default;
```

调用移动对象的成员函数前可用 `valueless_after_move()` 做调试期保护：

```cpp
void Widget::click() {
    assert(!pimpl_.valueless_after_move() && "use of moved-from Widget");
    ++pimpl_->clicks;
}
```

## 使用判断

- 只需要独占所有权、不要求复制值语义时，`std::unique_ptr` 仍很合适。
- PImpl 需要像普通值一样复制、希望 const 语义传递给实现对象时，`std::indirect` 更贴合目标。
- 两者的移动源对象都需要谨慎处理：`unique_ptr` 检查空指针，`indirect` 检查 `valueless_after_move()`。

## 兼容性

原文发布时仅 GCC 16 支持 `std::indirect`。在项目中使用前仍应确认所选编译器与标准库的实际支持情况。

## 来源

- [The PImpl idiom and the C++26 std::indirect type](https://mariusbancila.ro/blog/2026/07/23/the-pimpl-idiom-and-the-cpp26-stdindirect-type/) — Marius Bancila，2026-07-24
