+++
title = "Rust's Drop trait and drop function"
date = 2021-07-25
[taxonomies]
tags = ["rust", "traits", "drop"]
+++

Rust has been on my mind for the last couple of weeks and I wanted to get back into it (after wanting to get into it over a year ago). This blog has also been on my mind lately (and also left on the back burner over a year ago)... So let's get to it. This is just a simple note for myself that I can refer to later and solidify the concept.

The purpose of the **Drop** trait is to relinquish memory on the heap that the implementor instance owns. For example, if your object references any file, network, or database connection. The trait only has one method, drop, and is called automatically when the object goes out of scope.

Similarly, there is a **drop** function in the **std::mem** crate which has a super simple implementation:

```rs
// std::mem::drop

pub fn drop<T>(_x: T) { }
```

An empty function body, that's literally it. Since the variable is **moved** into the drop function into a new scope **{ }**, the variable is deallocated immediately after the function is called.

This function can be used to deallocate memory on the heap manually rather than automatically when it goes out of scope.

Here is a quick scope example/reminder from "Rust by Example":

```rs
// raii.rs
fn create_box() {
    // Allocate an integer on the heap
    let _box1 = Box::new(3i32);

    // `_box1` is destroyed here, and memory gets freed
}

fn main() {
    // Allocate an integer on the heap
    let _box2 = Box::new(5i32);

    // A nested scope:
    {
        // Allocate an integer on the heap
        let _box3 = Box::new(4i32);

        // `_box3` is destroyed here, and memory gets freed
    }

    // Creating lots of boxes just for fun
    // There's no need to manually free memory!
    for _ in 0u32..1_000 {
        create_box();
    }

    // `_box2` is destroyed here, and memory gets freed
}
```

Notice how we boxed the integer instead of creating an integer on the stack. The **Drop** trait only applies to memory allocated on the heap, and cannot be implemented by anything that implements the **Copy** trait (integers and other scalar types).
