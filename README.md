# Simple Dual Subtitles
(for Viki.com)

## Overview

This extension is a non-commercial personal project designed to assist language learners by enabling the display of two subtitles simultaneously on Viki.com. I created it because I wanted to watch shows with dual subtitles, and other solutions didn't work for me. It is not supported by or associated with Viki.com. I am responsible for any possible bugs.

## How It Works

The addon does not request or fetch any new data. Instead, it reads the subtitle data fetched during normal user interaction to display the subtitles. This approach avoids sending additional requests to the Viki servers. As a result, some minimal user interaction is needed to set up the dual subtitles (see "Usage" section).

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
