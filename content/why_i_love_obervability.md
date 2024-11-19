+++
title = "Why I love observability"
date = 2024-08-10
[taxonomies]
tags = ["OpenTelemetry", "Application Insights", "Well architected framework", "Observability"]
+++

## Why I love observability

<sub><sup>And why I think operational excellence is the most important pillar of the well architected framework</sub></sup>

### The 5 pillars of the well architected framework

Here are 4 of the pillars:

-   Make sure it's performant.
-   Build it with cost optimization in mind.
-   Make sure it's reliable.
-   Make it secure.

The foundation for all the other pillars of the Well Architected Framework is observability, which is part of the 5th operational excellence pillar. You can't quantify your success in any of these other categories without having some baseline; some starting point to show _how much_ you've improved.

Let's revisit the other pillars:

-   Make sure it's performant. How performant?
-   Build it with cost optimization in mind. Where can we save costs?
-   Make sure it's reliable. What's our current uptime?
-   Make it secure. How do we know when and if there is an attack?

### Collect metrics from the very beginning

We all need to build software that solves real business problems and we needed it yesterday. I get it. The last thing anyone wants to do is spend time writing code just collect metrics about the _real_ code that's solving _real_ problems. And let me tell you, metrics are a real business problem, and it's up to you to convince stakeholders that this effort is not for naught.

The wonderful thing is that it's a lot easier to add telemetry collecting capabilities to your project than you probably think. Through the widely adopted and supported OpenTelemetry framework, there is likely a package out there for your language of choice that adds auto-instrumentation capabilities to many of the dependencies that you're using.

The only initial startup cost might be to figure out where you are going to be dumping all the telemetry data. Lucky for us, many telemetry collectors are adopting the OpenTelemetry specification (OTel).

While working at my last job, our cloud provider of choice was Azure. All we had to do was install OpenTelemetry instrumentation libraries, which would hook into and collected various signals from logging, http client, Azure SDK, and other libraries, and the [Azure Monitor Open Telemetry exporter](https://github.com/Azure/azure-sdk-for-python/tree/azure-monitor-opentelemetry_1.6.1/sdk/monitor/azure-monitor-opentelemetry-exporter#microsoft-opentelemetry-exporter-for-azure-monitor) to get it in Application Insights/Diagnostics logs for querying and visualization.

Not in the cloud? Well you can dump OpenTelemetry data into Grafana, or a number of other destinations as well.

Is every scenario this easy? Well no. You might find that you want to instrument some code you wrote, or some 3rd party library yourself. Or even some code that runs in a unique environment (we did it for instrumenting Databricks python workflows!). For that, there is the Open Telemetry SDK. But more than likely, you can get started instrumenting libraries that are already supported and reap huge benefits.

### Correlate your data

Collecting metrics from various pieces in your architecture is useful on it's own. But chances are those pieces are talking to each other and you want to see how they all tie together in the bigger picture. Maybe you have a complex workflow that start a service A and ends at service Z. Did a failure happen somewhere in the middle and you have no idea where it is? You need [Context Propagation](https://opentelemetry.io/docs/concepts/context-propagation/), which will start the tracing context at one end, and capture everything in between to the end, so long as the same Trace Parent (trace id and parent span id) is passed along between each service boundary.

In the end, you should be able to query all the signals that were collected, using a single trace id.

### An analog for your architecture

Once we had all of infrastructure instrumented and the data was landing in a centralized location, we were able to visualize all the components, and how they were connected in Azure Monitor.

All of our logs, metrics, etc. became the _analog_ for our infrastructure. We could start pinpointing where bottlenecks were happening, where exceptions were being thrown, and drill down to the exact lines of code with all the context that came before it.

At the point, building alerts on top of these signals is easy. And you can start monitoring the performance, cost, reliability, and security of your system over time, and focus your engineering teams to tackle _known_ problems backed by _real_ data.

### How to get started

With the [observability primer](https://opentelemetry.io/docs/concepts/observability-primer/).
