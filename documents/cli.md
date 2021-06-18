# CLI tools

## How to init extension

To add arvis-workflow.json skeleton to current directory,

```
$ arvish init workflow
```

To add arvis-plugin.json skeleton to current directory,

```
$ arvish init plugin
```

## How to convert alfredworkflow's info.plist to arvis-workflow.json

To convert alfredworkflow's info.plist to arvis-workflow.json,

```
$ arvish convert
$ arvish convert info.plist
```

## How to build extension installer file

To build arvis-extension's directory to installer file.

```
$ arvish build
$ arvish build workflow /Users/user/Destop/some_extension
```

Note that `build` command exclude `files starting with dots`, `package-lock.json`, `yarn.lock`.

## How to build extension installer file

To validate arvis-extension json file

```
$ arvish validate workflow arvis-workflow.json
$ arvish validate plugin arvis-plugin.json
```

## Summary

```
Usage
    To add arvis-workflow.json skeleton to current directory,
        $ arvish init workflow

    To add arvis-plugin.json skeleton to current directory,
        $ arvish init plugin

    To convert alfredworkflow's info.plist to arvis-workflow.json,
        $ arvish convert
        $ arvish convert info.plist

    To build arvis-extension's directory to installer file, 
        $ arvish build
        $ arvish build workflow /Users/user/Destop/some_extension

    To validate arvis-extension json file,
        $ arvish validate workflow arvis-workflow.json
        $ arvish validate plugin arvis-plugin.json
```