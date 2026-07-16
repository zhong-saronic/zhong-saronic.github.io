1. Walk us through your decisions. What did you prioritize and why? What did you leave out? If Tara were sitting next to you, what
would you ask her before building the next version?

Priorities:

* I wanted to make something as simple and easy for Tara to use as possible. As a decision maker, she is most likely non-technical. I wanted to avoid having her do things like install docker / node / any other dependencies just to use this web application. Github Pages makes it easy to host simple web apps like this, so I configured it so all commits to the main branch are automatically pushed up, and all she has to do is go to the website at https://zhong-saronic.github.io/

* It should be very quick for Tara to get the information she wants. I wanted to reduce the amount of clicking she had to do to hop around to all of the different weather / marine datasets she is concerned about, so I put everything onto one page. Horizontally panning over one graph will also sync with the other graphs.

* Some of her thresholds were precise (e.g. Wind speed over 20 knots is a no-go, 15-20 is iffy), but other thresholds were vague (e.g. "we need decent visibility for the customer to actually see the vessel" - what is considered decent??). Because I wasn't sure exactly what she wanted there, I wanted to give her the ability to configure these thresholds to suit her own needs rather than hard coding something that cannot be changed. Perhaps there are some demos where she is willing to take more risk, or perhaps the vessels improve in performance down the line, and she can increase wind speed or wave height thresholds to compensate.

What I left out:

* I wanted to keep the UI as simple as possible. There were some datasets mentioned in the Challenge document such as "weather_code" that did not appear to be used in Tara's decision making. By removing that dataset, I could reduce the clutter in the UI

* Apart from the threshold sliders, there is no customization provided to Tara. i.e. Can't resize the graphs, drag and drop the panels to move them around. For a minimum viable product such as this, it would have been overkill, and it is better to get Tara's feedback on that first before doing anything like that.


Things I would ask Tara if she was sitting next to me:

* I would get her opinion on the UI since she is the primary user for now and ask her if there is anything she would want to adjust to make it a better experience for her. In the past, I've designed beautiful visualizations that my manager could not see because they were colorblind, so I want to be mindful about all of that.

* Other than the current weather / marine datasets, what other data (if any) would aid in her decision making? Knowing that would allow me to pull that data in as well to help her.

* Is she going to be the sole user of this going forward, or is this the first step in a broader application released to more people? If the latter, I may reconsider some design decisions to go more long term with this.




2. How would you evolve this tool? Tara wants to add the other demo sites (Panama City, Norfolk, San Diego). The boat captains
want a mobile version. PM's want to pull in historical weather patterns so Tara can push back on leadership scheduling demos during
storm season. How do you prioritize? What would you build next?

I would work closely with potential end users to evaluate what they want.
For all of the requested features, I evaluate the following:
1) Importance
2) Level of effort

For example, Tara wanting to add other demo sites as options would be LOW effort and HIGH importance.
I would definitely prioritize that next since it is very important and shouldn't take more than a few minutes to add into the code.

The captain wanting a mobile version would be MEDIUM importance and LOW effort (it almost already works on mobile).

The historical weather patterns would be HIGH importance (unsure, but Tara would probably rank it high! And I'd rank it high too if she is my manager). However, it would also be HIGH effort because I don't believe open-meteo stores historical weather that goes back too far. We would need to find another data source and potentially evaluate having a database to store historical data into if Tara wants to keep the data for more than a one time thing.

