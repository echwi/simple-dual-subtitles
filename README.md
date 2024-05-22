# Simple Dual Subtitles
(for Viki.com)

## Overview

This extension is a non-commercial personal project intended to help language learners by providing the possibility to show two subtitles at once on Viki.com. I started to build it because I wanted to watch shows with dual subtitles, and I couldn't get other solutions to work.

It is by no means supported by or associated with Viki.com. Every bug is solely caused by the extension and the way it is built. It also heavily relies on the current structure of the Viki website, which can change at any time.

## How It Works

The addon does not request or fetch any new data; it simply listens for and displays the subtitle data that it receives through user interaction. I implemented it this way to avoid sending requests to the Viki servers. Because of this, some user interaction is required to set up the dual subtitles:

## Installation

1. Install yarn, if you haven't installed it already, then use `yarn` and `yarn build` in the root folder of the project
2. Upload the newly created build folder as a browser addon in Chrome

## Usage

1. Navigate to a page with video subtitles.
2. Switch the subtitles to the target language and then switch back.
3. Open the extension and select the desired target language.

## Important Notes
1. **Timing**: Note that millisecond timing might occasionally be inaccurate due to the way the extension processes the subtitles.
2. **Dependency**: The functionality depends on Viki operating as it currently does. So it might stop working in the future if Viki changes its website structure.
