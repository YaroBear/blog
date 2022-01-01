+++
title = "Cargo workspace dependency woes"
date = 2021-12-31
[taxonomies]
tags = ["rust", "cargo", "troubleshooting", "cargo dependencies"]
+++

They said learning rust would feel like a constant battle with the compiler. They were right. Most of the time it's because of user error with a nice little message telling you how to fix the error. Nice. Easy.
When it's cargo yelling at you, it's because of some dependency conflict that is the fault of one of the many libraries in your dependency tree. Fun...

In this case I was working on adding the second GUI to my [minesweeper-rs project](https://github.com/YaroBear/minesweeper-rs), this time with the implementation using the Bevy game engine. I structured my project using [cargo workspaces](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html) so I wouldn't have to recompile the shared minesweeper-logic library for every GUI that I would build, and possibly other libraries that would be shared between Nannou, Bevy etc.

This is the error I ran into right as I added the minesweeper-bevy binary project to the workspace:
![nannou and bevy dependency error](/images/cargo_workspace_woes/nannou_bevy_error.png)

Nannou depends on `wgpu 0.11.0`
- Which has "loose" dependency on `wasm-bindgen ^0.2.76` (>= 0.2.76 and < 0.3.0)
  
Bevy depends on `wgpu 0.7.0`
- Which has a "strict" dependency on `wasm-bindgen =0.2.69` (has to be 0.2.69)

Cargo will attempt to pick a package that solves both of the requirements for `wasm-bindgen`, but *not* if they are constrained in the same compatibility range. In other words, cargo will pick *only one* version `0.2.*` that will satisfy the minor SemVer for both. But since `wgpu 0.7.0` has a strict dependency on a specific patch version, it goes with that one. This leaves `wgpu 0.11.0` requirements unsatisfied.

For more, see [semver compatibility](https://doc.rust-lang.org/cargo/reference/resolver.html#semver-compatibility).

Theoretically, `wgpu 0.7.0` shouldn't have such strict dependency on a patched version, as patches usually only include bug fixes and the like, and shouldn't break existing version with future patches. That's the definition of SemVer. O'well 🤷‍♂️.

To get around this, I think i'll just get rid of the cargo workspace.