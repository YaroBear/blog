+++
title = "What is a hydrometer and how do we build one?"
date = 2022-10-02
[taxonomies]
tags = ["hydrometer", "bridging the gap", "hydrostatics", "accelerometer", "archimedes' principle"]
+++


## What is a hydrometer?

A hydrometer is a device that measures the **relative density** of liquids. In beer brewing, a brewer takes a reading *before* fermentation to find out how much sugar was extracted from the malt into water, and then another reading *after* fermentation when the yeast has converted much of the sugar into alcohol and CO2. The difference between these two measurements gives you a fairly accurate alcohol content reading for the beer.

Because relative density is defined as the **ratio** of the densities of two different liquids, non-fermented beer, or *wort*, and water in our case, water is taken to be 1.000. When a hydrometer reads 1.050, this means the density of the wort is 1.050 times that of water.

A hydrometer can look like many things, but a very common one would look like this:

![Twaddel Hydrometer](/images/building_a_hydrometer/twaddels_hydrometer.webp)

Isaac Hopkins (Q106121459), Public domain, via Wikimedia Commons

This one is a glass tube, with a ballast at the bottom to give it upward stability when placed in water. Inside the glass tube is a paper scale that reads the relative density of the liquid when aligned with the surface of the liquid. The scale usually indicates at what temperature the scale was calibrated to. It is recommended that measurements are also taken at that same temperature but there various calculators out there that can adjust for temperature differences.

Questions thus far:
- Does atmospheric pressure affect relative density readings?
- What is the relationship of density and temperature, and how do we account for that in our readings?

A hydrometer can also have many names, such as an Alcoholometer, Lactometer, Saccharometer etc. They all have varying scales and units depending on what industry they're applicable to, but all operate on the same principle: **Archimedes' Principle**:
> A body at rest in a fluid is acted upon by a force pushing upward called the buoyant force, which is equal to the weight of the fluid that the body displaces. If the body is completely submerged, the volume of fluid displaced is equal to the volume of the body. If the body is only partially submerged, the volume of the fluid displaced is equal to the volume of the part of the body that is submerged. [Britannica](https://www.britannica.com/science/Archimedes-principle)

## How do we build an IOT enabled hydrometer?

While the hydrometer pictured above operates on vertical displacement and manual eye-seeing measurement, a tool I already own works by taking the **tilt** or **incline** of the device suspended in the liquid [Tilt Hydrometer](https://tilthydrometer.com/products/copy-of-tilt-floating-wireless-hydrometer-and-thermometer-for-brewing).

The goal of this project is to build a similar device.

The benefits of this device include:
- We can drop it into the fermenter and leave it in there. This enables us to monitor the health of our fermentation at any interval we choose, and know when fermentation is done.
- We limit the exposure of oxygen and unwanted microbes to our beer compared to taking manual samples.

### How can we get relative gravity using inclination?

Applying Archimedes' principle, we know that if we drop an object with known mass/density in water (assuming it doesn't completely submerge), it will sink *less* in liquid that has higher density. I.e. the volume of the submerged portion of the object will be less.

From observation of dropping things into water, we've seen that some objects do not float completely vertically, or horizontally. An object might float with some inclination. Likely because the object is top-heavy.

The assumption, or hypothesis, is that for this *non-uniform* object, it's inclination will be *greater* in denser liquids as less of it's volume is submerged under the liquid, and it's center of mass acts to tip it over.


### What device can we use to measure inclination?

Accelerometers are cheap and very useful sensors for measuring inclination. Here is a resource I found that seems very well written: [Analog, Accelerometer application](https://www.analog.com/en/app-notes/an-1057.html)

### Required math and physics concepts
From some quick online searching, the study of **hydrostatics** seems applicable:

> Branch of physics that deals with the characteristics of fluids at rest, particularly with the pressure in a fluid or exerted by a fluid (gas or liquid) on an immersed body. [Britannica](https://www.britannica.com/science/hydrostatics)

Glossing over some of the concepts from various searches, all of these seem to apply:
- Center of mass
- Moments of inertia
- Buoyancy

It's been a while since I've seen these concepts, but I found some textbook sources that should help out (All on libretext.org!):
- [Classical Mechanics, Tatum](https://phys.libretexts.org/Bookshelves/Classical_Mechanics/Classical_Mechanics_(Tatum))
	- Particularly chapters 1 (Centers of Mass), 2 (Moments of Inertia), and 16 (Hydrostatics).
	- Chapter 16 even has an example problem explaining the tendency for logs to fill up with water, and start to right themselves vertically as their density approaches that of water. Sounds very similar to the problem we're trying to solve!
- Here is a chapter from a calculus book that covers density, mass, and center of mass: [Active Calculus, using definite integrals for density, mass, and center of mass](https://math.libretexts.org/Under_Construction/Purgatory/Book%3A_Active_Calculus_(Boelkins_et_al.)/06%3A_Using_Definite_Integrals/6.03%3A_Density_Mass_and_Center_of_Mass)
- And another book to cross-study calculus: [Calculus, Gilbert Strang & Edwin  Herman](https://math.libretexts.org/Bookshelves/Calculus/Book%3A_Calculus_(OpenStax))

### Summary
There is quite a bit to learn in what was just outlined here. If you're not comfortable with all the concepts like me, take some time to learn from the materials or find some alternatives! My next post(s) will be summarizing some of the learnings, determining if the assumptions made were correct, and answering the questions above. Later posts will dive into some code, microcontrollers, and the sensors that will be used for the project.

