+++
title = "Bridging the gap: Building an IOT Hydrometer"
date = 2022-09-27
[taxonomies]
tags = ["esp8266", "i2c", "microcontroller", "hydrometer", "beer brewing", "bridging the gap"]
+++

![esp8266 with mpu6050](/images/building_a_hydrometer/project.webp)

![reading a hydrometer](/images/building_a_hydrometer/hydrometer.webp)

## Bridging the gap between tutorial following and making fully featured projects

The most frustrating thing about programming, and engineering in general, is that there is a load of resources on the two far ends of this spectrum: basic tutorials and amazing projects that others have built.

The bridge in the middle is no doubt the hardest, and most time consuming part of the process: knowledge and problem solving.

What motivated this guide are three things:

1. Bridging the gap for myself in the microcontroller, low-level programming, and applied mathematics space, and
2. Helping others bridge the gap (like a coding tutorial that you're used to, but with a heavy emphasis on a tutorial to *learning* and *applying those learnings*
3. I like to brew beer, and devices like the [Tilt Hydrometer](https://tilthydrometer.com/) really inspired me

Since I started thinking about this project a week ago, I've tried *really* hard to keep myself from searching "diy iot hydrometer", or "building a hydrometer using an accelerometer". I think that discipline is important; remember we are trying to arrive at the solution ourselves, no matter the struggle. The goal is to build the intuition and skills required for bridging the gap.

I encourage you to do the same, and read from the start to the end of this series without peeking. Try solving the problems yourself, try messing with the code, math, etc.

I only have a vague idea of how to solve this problem. It's a multifaceted problem and one that motivates me. 
This might not be the same for you, but hopefully my approach can lead you to solve a problem you might be interested in.

I am not a beginner in the software space, but my background is mostly in .net APIs, Angular front-end development, Azure stack of cloud development and deployments, and some Powershell scripting thrown in there.

Where I lack and what I intend it learn is:
- C/C++ and low-level programming in general
- Arduino, microcontrollers and interfacing with the wide variety of sensors out there and their protocols
- A deep understanding of mathematics, and the application of (i.e [Applied Mathematics](https://en.wikipedia.org/wiki/Applied_mathematics))

So hopefully this guide is one that comes from experience, but more importantly *inexperience* so that you may feel like we are in the same shoes trying to bridge the gap. There are many concepts I don't know, so you will see many explanations and all the resources from which they were derived. I intend to use all open source, or freely and easily accessible resources.

Let's begin.
