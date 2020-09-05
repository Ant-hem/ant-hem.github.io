---
date: 2020-8-31
tag: 
  - C++
  - cpp
  - clangd
  - iwyu
  - vscode
author: Antoine
location: Paris, France
---

# IWYU VSCode Integration

**Include What You Use** also known as [IWYU](https://github.com/include-what-you-use/include-what-you-use), is an open-source clang-based tool for determining what include statements are needed in C/C++ files. Even if it's [not perfect](https://github.com/include-what-you-use/include-what-you-use#how-to-correct-iwyu-mistakes), it's quite useful to clean headers in a new or a legacy project.

Now that you know everything about **IWYU**, let's discover how to install this tool and integrate it into your VSCode setup.

## IWYU Installation

First step, let's install the software.

You can either build it directly from the source or download it from your favorite package manager. For this tutorial let's download the pre-built binaries.

```bash
# OSX
brew install iwyu

# Linux
apt-get install -y iwyu
```

## COMPILE_COMMANDS.json

**IWYU** requires the [compile_commands.json](https://sarcasm.github.io/notes/dev/compilation-database.html) file to determine unused includes. This file can be generated by your favorite build system generator, for example with CMake we just need to add `-DCMAKE_EXPORT_COMPILE_COMMANDS=1` to our build command:

```bash
cmake -H. -B build -DCMAKE_EXPORT_COMPILE_COMMANDS=1
```

A `compile_commands.json` should be generated in the build folder.

## Clean All The Includes

**IWYU** comes with two Python scripts: `iwyu_tool.py` and `fix_includes.py`. `iwyu_tool.py` is meant to be run before `fix_includes.py`.

Run the command below in the build folder where the `compile_commands.json` file is located. The command will generate the report of changes redirecting into the file iwyu.log.

### Generate iwyu.log

```bash
iwyu_tool.py -p . > iwyu.log
```

Lots of options are available with **IWYU** like restricting the processing to a file, a folder, a regex... One can find them with the following command:

```bash
iwyu_tool.py --help
```

### Cleaning the Includes

One can now clean the includes in their code base with the following command:

```bash
fix_includes.py < iwyu.log
```

⚠️ **Important Note**: *This command can take a long time depending on the size of your project. One can speed-up the cleaning by adding concurrent sub-processes with the `-j` arguments.*

Please also note that the command will use **IWYU's** default configuration. Some styling conventions are configurable like: include orders, namespace, etc. All those options can be found with `fix_includes --help`

💡 *Don't hesitate to check [IWYU's official documentation](https://github.com/include-what-you-use/include-what-you-use/tree/master/docs) as well.*

## VSCode Integration - Cleaning Current Edited File

Wouldn't that be great to have an IDE like action to clean the headers of the current file we are working on? Thanks to **IWYU** and VSCode tasks that's possible!

### IWYU: Cleaning One File

**IWYU** also let's us the possiblity to clean one file with the following command:

```bash
iwyu_tool.py -p <build_dir> <path_to_file_to_clean> | fix_includes.py
```

Let's integrate this command into VSCode.

### VSCode: Task to Clean Headers

VSCode offers us the possibility to customize our dev workflow with the help of the `tasks.json`. Let's craft a simple VSCode task to clean the current file we are working on.

```json
{
    "tasks": [
        {
            "type": "shell",
            "label": "Clean Current File Includes (IWYU)",
            "command": "iwyu_tool.py -p build ${relativeFile} | fix_includes.py",
            "presentation": {
                "reveal": "always" // Used to show the progress of the command
            },
            "options": {
                "cwd": "${workspaceRoot}" // Tell that the command should be ran from the opened workspace
            },
        }
    ],
    "version": "2.0.0"
}
```

💡 *More information about task.json can be found on [VSCode's doc](https://code.visualstudio.com/docs/editor/tasks).*

This task assumes our `compile_commands.json` file is located in the `build` folder. If for your project the folder is located elsewhere, feel free to change it!

The task is quite simple to write thanks to the predefined VSCode's variable `${relativeFile}`. This variable holds the currently opened file path relative to the `workspaceFolder`, which is exactly what we needed.

All VSCode's predefined variables can be found [here](https://code.visualstudio.com/docs/editor/variables-reference).

### Task Key Binding

Now, how to run quickly this new `task` from VSCode? 

Unfortunately, there is no default shortcut defined for the tasks, we will have to define one. Go to `Preferences > Keyboard Shortcuts` and assign a key binding to the following key:

```json
workbench.action.tasks.runTask
```

For my OSX setup, I have set the shortcut to `⇧⌘T` to stay consistent with the other VSCode shortcuts. When I hit `⇧⌘T` it prompts the following:

![img](/img/iwyu.png)

Sweet isn't it? You can now clean dusty headers directly from VSCode 😀.

## Closing Words

If you enjoyed this article feel free to share it and tell me on [Twitter](https://twitter.com/Antoine_hy)!

See you soon for another article 👋