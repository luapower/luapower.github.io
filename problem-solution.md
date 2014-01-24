---
title:    "problem. solution"
tagline:  \"and here's where I keep assorted lengths of wire\" - HJF
---

> This episode is a big fat rant, you have been warned.

## What is the problem that luapower is trying to solve?

  * PORTABLE: git-tree == work-tree == deploy-tree
  * MODULAR: independent packages, no big zip file or repo
  * ON GITHUB: fork, pull requests, web hosting
  * NO DIRECTORIES: no navigation
  * BINARIES: get code running in minutes
  * SOURCES & BUILD SCRIPTS: don't wait for me to upgrade
  * PACKAGE DATABASE: choose based on multiple criterias
  * DOCUMENTATION: browsable online, editable offline
  * FREEDOM: as-in freedom from others

## PORTABLE

So that the whole work tree can be moved around from system to system,
and even between different platforms, and just work.

This means including the binary dependencies that the code was actually tested against, instead of relying
on the OS ones, and making sure that Lua loads the local ones over the system ones.

It also means putting together all the binaries for all platforms in the same branch together.
If space is really a problem (android) then deleting other platform directories just before packaging
the app is easier than checking out platform branches for each module.

Finally, zero deployment means the work tree is good as deployment tree.

## MODULAR

I want each Lua module to have its own life and death, its own repo, commit history, issues and forks
and pull requests.

## ON GITHUB

To me the biggest barrier to getting involved in projects online is the friction that our communication tools
inflict on us. This goes for anything from correcting a typo on wikipedia to submitting a patch to the Linux kernel.
Github is just one way to lower that barrier.

## NO DIRECTORIES

This is a hard sell, I admit, but I stand by it. Directories are evil. Not so much because of semantics (hierarchies),
but because of the tools we use (file browsers, code editors, IDEs) suck at working with them. You don't have
instant search in most of them (sublime text excepted), but you have to "navigate" them instead. I know many
programmers that are crazy about making deep hierarchies with 2-3 files each. Mostly that's a technique
to help organizing a program in your head, in the process of understanding it. So if you feel uneasy about a big
flat list of files, go ahead and arrange them into categories and then after the hierarchy is in your head,
put them back together because you don't need that mirrored into the filesystem as well.

## BINARIES

I should not be forced to compile stuff. Not even in Linux. You should let me play around with the library
before I even decide if I want to incorporate it in my project or not. It's really easy, you go to IKEA,
you sit on an _assembled_ couch, and then, _maybe_ you go downstairs and get yours in pieces. I wonder
why jsfiddle is so popular...

## C SOURCES & BUILD SCRIPTS

I know I'm going against the grain with this one, but I deeply hate C build systems and I think for
the most part that they are unnecessary. For me the success rate for going from `make` to a `dll` on the first
shot has always been pretty pathetic. Building with one-liner gcc scripts is much more transparent,
which directly affects my ability and motivation to fix problems (which in turn affects the number of packages built).
It is much faster too.

But the real reason is your freedom, being confident that you can extend, upgrade and maintain your own system
without depending on someone else.

## PACKAGE DATABASE

TODO: c lib versions, download url, platforms, licenses

## DOCUMENTATION

Need to be in a standard format, good for plain-text consumption and production, with good table
support (invaluable for tech docs of any kind), independent of any wiki engine, web framework or hosting provider.
Tried asciidoc, but had complex table syntax. Tried pandoc, figured a philosopher Haskell coder dude should
know his thing. Turns out pandoc can do much more than what I need and you can even write custom writers
in Lua (and filters in any language that can read and write json).
It also supports a variety of markup formats for input which could be used (theoretically)
for aggregating 3rd party docs into the website.

## PROBLEMS STILL TO BE SOLVED

### Federation

In my imaginary ideal world, github is but a piece of open source that everyone can host on a VPS and publish
his/hers repos and tweak it the way they like (eg. I would immediately put pandoc on it and remove the ridiculous
cattopus thing). In this imaginary world, two computers can talk to one another directly without hole punching,
and the identity problem has been solved, so people don't have to "login with facebook" anymore, thus the social
components of github would not be compromised. This major perspective shift from a world of online services like
github to a network of personal servers... TODO

### Appropriation

How can I make this useful to _me_ and my particular circumstance?
What if I have a different idea about what luapower should include or how it does certain things or maybe I just
don't like the color theme? What if the project dies? Why tie an idea to its maker?
Why should I be stuck to crying to github owners to add `git --describe --tags` to their API (because I want
to display that on my website) and then wait years for that to happen? Why do the github people have to have
their priorities and preferences aligned with mine? Why do we build software in such a way that
ties us together instead of liberating us? In this way, github is no more open-source than my pirated copy
of photoshop.

### Integrating 3rd party documentation into the website

TODO

### Figuring out dependencies of demos and test units

Currently there's no way to load a script/app (as opposed to a module) and track its `require` calls without
actually running it. Thus the dependencies of demos and test units are not listed and must be figured by trial & error.

## WHY THIS HAS TO WORK

The reason markdown won the markup contest is that it is just formalizing the way people already communicate.
Luapower is just standardizing what I was already doing. My google code gig
was the most frictionless system to set up. It used mercurial (easier than git), I had a single repo (just commit and push
at the end of the day), built-in wiki with online editing (good system too - it had table of contents and an ugly way
to write tables)

## THE PACKAGE MANAGER

Well, anything with manager in the title has _something_ wrong with it, but package managers and build systems
are like those Honda robots, change anything the environment and they crash like a ton of bricks.

