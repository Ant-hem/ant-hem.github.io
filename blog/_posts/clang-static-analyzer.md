---
date: 2020-9-14
tags: 
  - C
  - C++
  - cpp
  - static analysis
  - scan-build
  - clang static analyzer
author: Antoine Hémery
location: Paris, France
---


# Clang Static Analyzer (scan-build) Setup

## What is scan-build?

**Clang Static Analyzer** (also known as `scan-build`) is a source code analysis tool that finds bugs in C, C++, and Objective-C programs. The analyzer is a 100% open source tool and is part of the Clang project. Like the rest of Clang, the analyzer is implemented as a C++ library that can be used by other tools and applications.

One thing to be aware of is that compiling with `scan-build` is slower than a standard compilation because it runs [checkers](https://clang.llvm.org/docs/analyzer/checkers.html#id27) to analyze the code. `scan-build` checker's strength resides in their abilities to perform control flow graph inspection path-based analysis.

When `scan-build` has finished analyzing the code, it produces a sweet HTML report. This output is perfect as it shows the path has taken the analyzer to find the bug.

![img](/img/scan-build.png)

*[Source](https://clang-analyzer.llvm.org/annotations.html)*

Now that you know (almost) everything about `scan-build`, let's discover how to use it in our code-base.

## Installation

### MacOS

If one installed LLVM with brew (`brew install llvm`) scan-build will be located in the bin folder of your LLVM’s install.

```bash
/usr/local/opt/llvm/bin/scan-build
```

### Linux

Same as MacOS, scan-build should be packed with your LLVM’s install, most likely in `usr/local/bin`. If one can’t find the binary on their setup, one can directly download the binary on the [official website](https://clang-analyzer.llvm.org/).

### Build From Source

If you prefer to directly build the tool from its source, a guide is available [here](https://clang.llvm.org/get_started.html#build).

## Scan-Build Usage

The analyzer is pretty straight forward to use. It’s a two steps process. We need to first let **CMake** running its magic and then build the project with the help of **scan-build** and **make**.

*⚠️  Note: From the documentation, it's still not clear if Ninja is fully supported by scan-build. However, we can still parallelize the build with make.*

From my experience `scan-build` requires a full rebuild to provide an accurate output, I wrote a simple shell script performing all the necessary steps. Let's discover how it works.

```bash
#!/bin/bash

# Optional: I recommend to disable CCache if you are using it.
export CCACHE_DISABLE=1

# Clean existing build directly if present.
# A full rebuild is preferable to have a stable output.
rm -rf build

# Running CMake with scan-build
scan-build --use-cc=clang --use-c++=clang++ cmake -H. -Bbuild

# Building with Make and scan-build
# -j is here to speed up a little the process by parallelizing it.
scan-build --use-cc=clang --use-c++=clang++ make -C build -j2
```

Running those commands will output an HTML report if `scan-build` finds an error in your project. This report's output is configurable if you prefer to render a `yml` or a `plist` file.

💡  ***Tip:*** Does your project include vendor libraries? Don't forget to exclude them from the analysis with the `--exclude` option!

💡  ***Tip:***  `--use-cc [compiler path]` arguments are important because scan-build analyzes a project by interposing a "fake compiler" thus we need to tell it the one we normally use. If you are on OSX and using LLVM clang instead of the Apple one, make sure `--use-cc` and `--use-cc++` points to the binaries present in `/usr/local/opt/llvm/bin/`.

### Going further

This article is just an introduction to `scan-build`! In fact, scan-build offers lots of options and could be customized for your project.

- Looking for more checkers? Have a look at the [Experimental Checkers](https://clang.llvm.org/docs/analyzer/checkers.html#experimental-checkers)
- Need a custom checkers? [Write your own](http://clang-analyzer.llvm.org/checker_dev_manual.html)
- Looking for advanced customization for your project? `scan-build --help`

## Closing Words

Happy bugs squashing!

If you enjoyed this article feel free to share it and tell me on [Twitter](https://twitter.com/Antoine_hy)! See you soon for another article 👋
