MOCK_TEST = {
    "title": "Full IELTS Academic Test #3",
    "description": "A complete IELTS Academic practice test covering gym facilities, public transport, archaeological research, coral reefs, soil microbiomes, quantum computing, and traditional Japanese agriculture.",
    "duration_minutes": 165,
    "difficulty": "Academic",
    "sections": [
        {
            "type": "listening",
            "order": 1,
            "time_limit": 30,
            "title": "Listening",
            "passages": [
                {
                    "title": "Section 1: Gym Membership Enquiry",
                    "text": (
                        "M: Hello, I am interested in joining your gym. Could you tell me about the different "
                        "membership options you offer?\n"
                        "W: Of course. Welcome to Peak Fitness. My name is Laura. We have three main membership "
                        "tiers. The first is our Basic membership, which costs twenty-nine pounds per month. "
                        "This gives you access to the gym floor and the changing rooms between six in the morning "
                        "and ten in the evening, Monday to Friday. Access on weekends is from eight in the morning "
                        "until six in the evening.\n"
                        "M: I see. What does the second tier include?\n"
                        "W: The second tier is our Standard membership, which is forty-five pounds per month. "
                        "This includes everything in the Basic membership, plus unlimited access seven days a week, "
                        "entry to all group fitness classes such as spinning, yoga, and HIIT, and use of the sauna "
                        "and steam room. It also includes a free induction session with one of our personal trainers "
                        "when you first join.\n"
                        "M: And the third tier?\n"
                        "W: The third tier is our Premium membership at sixty-nine pounds per month. "
                        "This includes everything in the Standard membership, plus four personal training sessions "
                        "per month, unlimited use of the swimming pool, access to our rooftop relaxation area, "
                        "and a fifteen percent discount at the juice bar. Premium members also get priority booking "
                        "for all classes and events.\n"
                        "M: The Premium membership sounds comprehensive, but it is more than I was expecting to pay. "
                        "Does the Standard membership include access to the swimming pool?\n"
                        "W: I am afraid not. The swimming pool is exclusive to Premium members. However, "
                        "you can add pool access to a Standard membership for an additional ten pounds per month, "
                        "which would bring it to fifty-five pounds.\n"
                        "M: That might be a good compromise. Is there any joining fee?\n"
                        "W: Yes, there is a one-time joining fee of thirty pounds for all membership tiers. "
                        "This covers your initial induction, your membership card, and the setup of your account "
                        "in our system. We do occasionally run promotions where the joining fee is waived, "
                        "but there is not one running at the moment.\n"
                        "M: Understood. Can I pay by direct debit?\n"
                        "W: Yes, direct debit is our preferred payment method. Payments are collected on the first "
                        "of each month. We also accept credit and debit card payments, but not cash. "
                        "If you set up a direct debit, your first monthly payment will be taken on the first "
                        "of next month, and the joining fee will be collected at the same time.\n"
                        "M: What is the minimum contract period?\n"
                        "W: Our standard contracts are twelve months. However, we also offer a rolling monthly "
                        "contract at a slightly higher rate. For example, the Standard membership on a rolling "
                        "monthly contract is fifty-two pounds per month instead of forty-five. This gives you "
                        "more flexibility if you are not sure how long you will need the membership.\n"
                        "M: I think the twelve-month contract is fine. I am planning to be in the area for at least "
                        "a year. Could you tell me about the facilities? I am particularly interested in the "
                        "weight training area.\n"
                        "W: Our gym has over two hundred pieces of equipment. The weight training area includes "
                        "a full range of free weights from two kilograms up to fifty kilograms, power racks, "
                        "squat racks, Olympic lifting platforms, and a dedicated functional training zone with "
                        "kettlebells, battle ropes, and medicine balls. We also have a cardio theatre with "
                        "treadmills, rowing machines, cross trainers, and stationary bikes, all equipped with "
                        "individual television screens.\n"
                        "M: That sounds excellent. How busy does it get during peak hours?\n"
                        "W: Our busiest times are typically between six and eight in the morning and between five "
                        "and seven in the evening on weekdays. During these times, you may occasionally have to "
                        "wait for popular equipment. However, we have recently expanded the gym floor by thirty "
                        "percent, so wait times have decreased significantly. The quietest times are usually "
                        "between ten in the morning and two in the afternoon on weekdays.\n"
                        "M: That works well for me. I usually train in the middle of the day. "
                        "When can I come in to sign up?\n"
                        "W: You are welcome to come in at any time during our opening hours. I would recommend "
                        "bringing a form of photo identification and a bank card for the initial payment. "
                        "We can have you set up and ready to train within about thirty minutes.\n"
                        "M: Wonderful. I will come in tomorrow morning. Thank you for your help, Laura.\n"
                        "W: You are very welcome. We look forward to seeing you at Peak Fitness."
                    ),
                    "order": 1,
                    "questions": [
                        {
                            "type": "form_completion",
                            "text": "The Basic membership costs £______ per month.",
                            "correct": ["29", "twenty-nine"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The Standard membership costs £______ per month.",
                            "correct": ["45", "forty-five"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The Premium membership costs £______ per month.",
                            "correct": ["69", "sixty-nine"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "The swimming pool can be added to a Standard membership for an extra £______ per month.",
                            "correct": ["10", "ten"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The one-time joining fee is £______.",
                            "correct": ["30", "thirty"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "What is the rolling monthly price for the Standard membership?",
                            "correct": ["52 pounds", "£52", "fifty-two pounds"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The weight training area has free weights from 2 kg up to ______ kg.",
                            "correct": ["50", "fifty"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "When is the gym typically at its busiest?",
                            "options": [
                                "Between 10am and 2pm",
                                "Between 6-8am and 5-7pm on weekdays",
                                "On weekend mornings",
                                "Throughout the day on Saturdays"
                            ],
                            "correct": ["Between 6-8am and 5-7pm on weekdays"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "The gym floor was recently expanded by fifty percent.",
                            "correct": ["FALSE"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "Premium members get a ______ percent discount at the juice bar.",
                            "correct": ["15", "fifteen"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Section 2: Public Transport Guide",
                    "text": (
                        "Good morning, and welcome to the Greenfield City Public Transport Information Session. "
                        "My name is Michael Torres, and I am the Customer Services Manager for Greenfield Transit. "
                        "Today I will walk you through everything you need to know about getting around the city "
                        "using our public transport network.\n\n"
                        "Greenfield City has an integrated public transport system consisting of buses, a metro "
                        "railway, and a tram network. All three modes of transport are operated under a single "
                        "ticketing system, which means that one ticket is valid across all three. Tickets can be "
                        "purchased from vending machines at every metro and tram station, from authorised retailers "
                        "such as newsagents and convenience stores, or through the Greenfield Transit mobile "
                        "application, which is available for both iOS and Android devices.\n\n"
                        "Let me explain the different ticket types available. The single-journey ticket costs "
                        "one pound eighty for a journey within the central zone. The central zone, which we call "
                        "Zone A, encompasses the city centre and surrounding areas within a five-kilometre radius. "
                        "There are three additional concentric zones, B, C, and D, extending outwards. "
                        "A single journey that crosses from Zone A into Zone B costs two pounds forty. "
                        "A journey from Zone A through to Zone C costs three pounds ten, and a journey spanning "
                        "all four zones costs three pounds eighty.\n\n"
                        "For regular commuters, we offer a range of travelcards. A weekly travelcard for Zone A "
                        "costs sixteen pounds fifty, providing unlimited travel within that zone for seven consecutive "
                        "days. A weekly all-zones travelcard costs thirty-eight pounds. Monthly travelcards offer "
                        "further savings. The monthly Zone A travelcard is fifty-five pounds, and the monthly "
                        "all-zones travelcard is one hundred and twenty-eight pounds. Annual travelcards represent "
                        "the best value, with a Zone A annual pass costing five hundred and twenty pounds "
                        "and an all-zones annual pass costing one thousand two hundred pounds.\n\n"
                        "Our bus network consists of forty-two routes covering the entire metropolitan area. "
                        "Buses run from five-thirty in the morning until midnight on weekdays, with reduced "
                        "frequency during evening hours. On weekends, services begin at six in the morning and run "
                        "until one in the morning. Night bus services, identified by the prefix N, operate on "
                        "twelve key routes between midnight and five-thirty in the morning on Fridays and Saturdays.\n\n"
                        "The metro railway has three lines. The Red Line runs north to south through the city centre "
                        "and is the busiest line, carrying approximately four hundred thousand passengers per day. "
                        "The Blue Line runs east to west and connects the city centre with the international airport, "
                        "which is a twenty-minute ride from the central station. The Green Line forms a loop around "
                        "the outer suburbs and is particularly useful for passengers travelling between suburbs "
                        "without passing through the city centre. Metro trains run every three minutes during peak "
                        "hours and every six to eight minutes during off-peak times.\n\n"
                        "The tram network consists of two lines with a combined total of twenty-eight stops. "
                        "Trams run every ten minutes during peak hours and every fifteen minutes during off-peak "
                        "hours. The tram system is fully accessible for wheelchair users, with low-floor vehicles "
                        "and level boarding at all stops.\n\n"
                        "I should mention that all of our vehicles are equipped with free wireless internet, "
                        "real-time journey information displays, and CCTV cameras for passenger safety. "
                        "Our staff undergo regular accessibility training, and we offer a companion travel scheme "
                        "for passengers with disabilities who may need assistance. Under this scheme, a companion "
                        "can travel free of charge when accompanying a passenger who holds a valid disability "
                        "travelcard.\n\n"
                        "If you have any further questions after this session, our customer service helpline "
                        "is open from seven in the morning until ten in the evening, seven days a week. "
                        "You can also visit our website for journey planning, real-time service updates, "
                        "and fare information. Thank you very much for your attention."
                    ),
                    "order": 2,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "How many modes of transport are included in the Greenfield integrated system?",
                            "options": ["Two", "Three", "Four", "Five"],
                            "correct": ["Three"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "A single-journey ticket within Zone A costs £______.",
                            "correct": ["1.80"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "A weekly all-zones travelcard costs £______.",
                            "correct": ["38", "thirty-eight"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "A monthly all-zones travelcard costs £______.",
                            "correct": ["128", "one hundred and twenty-eight"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "An annual all-zones travelcard costs £______.",
                            "correct": ["1200", "one thousand two hundred"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "How many bus routes does Greenfield have?",
                            "correct": ["42", "forty-two"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "Which metro line carries the most passengers?",
                            "options": ["Blue Line", "Green Line", "Red Line", "Yellow Line"],
                            "correct": ["Red Line"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "How long does it take to travel from the central station to the airport on the Blue Line?",
                            "correct": ["20 minutes", "twenty minutes"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Night bus services operate every night of the week.",
                            "correct": ["FALSE"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Under the companion travel scheme, the companion travels free of charge.",
                            "correct": ["TRUE"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Section 3: Archaeology Research Discussion",
                    "text": (
                        "Dr Patel: Good morning, both of you. Thank you for coming to discuss your fieldwork "
                        "plans. Before we get into the details, why don't you each give me a brief summary "
                        "of your research focus for this summer's excavation season? Aisha, would you like to "
                        "start?\n\n"
                        "Aisha: Yes, of course. My research focuses on Roman-British pottery assemblages "
                        "from rural settlement sites in the East Midlands. I am particularly interested in "
                        "understanding patterns of trade and exchange during the second and third centuries CE. "
                        "By analysing the chemical composition of pottery sherds using petrographic thin-section "
                        "analysis and X-ray fluorescence, I hope to identify the original production centres "
                        "of the pottery and thereby reconstruct trade routes between rural settlements and "
                        "urban markets.\n\n"
                        "Dr Patel: That is a very well-defined research question. Tom, how about you?\n\n"
                        "Tom: My work is quite different. I am studying the environmental archaeology of "
                        "medieval monastic granges in Yorkshire. Specifically, I am analysing soil micromorphology "
                        "and plant macro-remains from excavation layers to understand how monastic communities "
                        "managed their agricultural resources between the twelfth and fifteenth centuries. "
                        "I am also looking at faunal remains to reconstruct livestock husbandry practices.\n\n"
                        "Dr Patel: Excellent. Both projects are ambitious, and I think they will complement each "
                        "other nicely during the fieldwork. Let me ask you both about your methodological approaches. "
                        "Aisha, you mentioned petrographic analysis. Have you completed the necessary training "
                        "for operating the thin-section equipment?\n\n"
                        "Aisha: I completed the introductory course last semester, but I have not yet been trained "
                        "on the X-ray fluorescence spectrometer. I was hoping to arrange that during the first "
                        "week of the excavation.\n\n"
                        "Dr Patel: That should be fine. Dr Chen in the laboratory can provide that training. "
                        "Make sure you book a slot with her before you arrive, because her schedule fills up quickly "
                        "during the summer. Tom, what about your soil analysis? Will you be collecting samples "
                        "in the field or working primarily with material that has already been excavated?\n\n"
                        "Tom: I will be collecting new samples directly from the excavation trenches. "
                        "I plan to take undisturbed soil monoliths from each main stratigraphic layer. "
                        "I will need about fifty grams of material from each context for the micromorphology "
                        "analysis, and a further two hundred grams for the flotation process to recover "
                        "plant macro-remains.\n\n"
                        "Dr Patel: Have you thought about how you will preserve the integrity of those samples "
                        "during transport? Soil micromorphology samples need to be kept completely undisturbed "
                        "to be useful.\n\n"
                        "Tom: I have prepared aluminium foil-wrapped blocks lined with a rigid foam casing. "
                        "I was planning to transport them in custom wooden boxes to prevent any vibration damage.\n\n"
                        "Dr Patel: That sounds like a sensible approach. I would also recommend wrapping each "
                        "block in bubble wrap as an additional precaution, and labelling each one with its context "
                        "number, trench number, and date of collection before you leave the site. "
                        "Lost or mislabelled samples can compromise an entire analysis.\n\n"
                        "Aisha: Dr Patel, could I ask about the logistics of the pottery analysis? "
                        "I will need to wash and sort a large quantity of sherds before I can begin the laboratory "
                        "work. Will there be enough space in the on-site processing area?\n\n"
                        "Dr Patel: The processing area is being expanded this year, so there should be more room "
                        "than last time. However, I would recommend washing your sherds in the field as you go, "
                        "rather than accumulating a large backlog. This will also give you the opportunity to "
                        "make preliminary observations about fabric types and forms as you work. "
                        "A systematic recording system from the outset will save you a great deal of time later.\n\n"
                        "Aisha: That makes sense. I have prepared a recording proforma based on the standard "
                        "Pottery Research Group guidelines. I was planning to enter the data directly into "
                        "a spreadsheet on a tablet computer.\n\n"
                        "Dr Patel: Good. Make sure you back up your data daily. We lost a significant amount "
                        "of information two years ago when a student's tablet malfunctioned. "
                        "Use the cloud-based backup system that the department provides.\n\n"
                        "Tom: Dr Patel, one more question. I noticed in the site brief that the area we will "
                        "be excavating this year may contain features from both the Roman and medieval periods. "
                        "Would it be possible for me to assist Aisha with some of the Roman pottery contexts "
                        "while she is on site? It would be a valuable learning experience for me.\n\n"
                        "Dr Patel: That is a very cooperative suggestion, Tom. I think that could work well, "
                        "provided it does not interfere with your own sampling schedule. Perhaps you could both "
                        "agree on specific days or contexts where collaboration would be mutually beneficial. "
                        "I will leave that for you to discuss."
                    ),
                    "order": 3,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "What does Aisha's research focus on?",
                            "options": [
                                "Medieval monastic farming",
                                "Roman-British pottery assemblages",
                                "Soil micromorphology",
                                "Environmental archaeology"
                            ],
                            "correct": ["Roman-British pottery assemblages"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What period does Tom's research cover?",
                            "options": [
                                "Second to third centuries CE",
                                "Twelfth to fifteenth centuries",
                                "Pre-Roman Iron Age",
                                "Nineteenth century"
                            ],
                            "correct": ["Twelfth to fifteenth centuries"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "Who can provide Aisha with training on the X-ray fluorescence spectrometer?",
                            "correct": ["Dr Chen"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "Tom needs about ______ grams of material from each context for micromorphology analysis.",
                            "correct": ["50", "fifty"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "What material does Tom use to line his sample containers?",
                            "correct": ["rigid foam", "foam casing"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Dr Patel recommends washing pottery sherds in batches at the end of each week.",
                            "correct": ["FALSE"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What standard does Aisha's recording proforma follow?",
                            "options": [
                                "University guidelines",
                                "Pottery Research Group guidelines",
                                "English Heritage standards",
                                "International Archaeological Standards"
                            ],
                            "correct": ["Pottery Research Group guidelines"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "A student lost data two years ago because of a tablet malfunction.",
                            "correct": ["TRUE"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What does Tom suggest to Dr Patel at the end of the discussion?",
                            "options": [
                                "Extending the fieldwork season",
                                "Assisting Aisha with Roman pottery contexts",
                                "Changing his research topic",
                                "Working on a different excavation site"
                            ],
                            "correct": ["Assisting Aisha with Roman pottery contexts"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "Flotation is used to recover plant ______-remains.",
                            "correct": ["macro"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Section 4: Coral Reef Ecosystems Lecture",
                    "text": (
                        "Good afternoon, everyone. In today's lecture, we will be exploring one of the most "
                        "biologically diverse and ecologically important ecosystems on Earth: coral reefs. "
                        "Often referred to as the rainforests of the sea, coral reefs cover less than one percent "
                        "of the ocean floor yet support approximately twenty-five percent of all known marine species. "
                        "Understanding how these ecosystems function is essential not only for marine biology "
                        "but also for the hundreds of millions of people worldwide who depend on coral reefs "
                        "for food, income, and coastal protection.\n\n"
                        "Let me begin by explaining what coral actually is. Despite their rock-like appearance, "
                        "corals are animals. Each coral colony is made up of thousands of tiny organisms called "
                        "polyps, each only a few millimetres in diameter. The polyp secretes a hard calcium "
                        "carbonate skeleton, which over centuries accumulates to form the massive reef structures "
                        "that we can see from space. The largest of these, Australia's Great Barrier Reef, "
                        "stretches over 2,300 kilometres along the northeast coast and is visible from orbit.\n\n"
                        "The relationship between coral polyps and the microscopic algae that live within their "
                        "tissues, known as zooxanthellae, is one of the most important symbiotic partnerships "
                        "in nature. The zooxanthellae photosynthesise, converting sunlight into energy and providing "
                        "the coral with up to ninety percent of its nutritional requirements. In return, the coral "
                        "provides the algae with shelter and the nutrients necessary for photosynthesis, including "
                        "carbon dioxide and nitrogenous waste products. This partnership is also responsible for "
                        "the vibrant colours of healthy coral reefs. When coral is stressed, it expels the "
                        "zooxanthellae, resulting in a phenomenon known as coral bleaching, which I will discuss "
                        "in more detail shortly.\n\n"
                        "Coral reefs support an extraordinary diversity of life. A single square metre of healthy "
                        "coral reef can support over one hundred species of invertebrates alone. Fish are among "
                        "the most visible reef inhabitants, with over four thousand species found on coral reefs "
                        "worldwide. These range from tiny gobies measuring just a centimetre in length to large "
                        "groupers and reef sharks. Coral reefs also provide critical habitat for sea turtles, "
                        "which use reef crevices for shelter and forage on reef-associated organisms. "
                        "Seven of the world's thirteen species of sea turtle are found on or near coral reefs.\n\n"
                        "Beyond their biological importance, coral reefs provide a range of ecosystem services "
                        "that are vital to human populations. Coastal protection is one of the most significant. "
                        "Healthy coral reefs act as natural breakwaters, dissipating up to ninety-seven percent "
                        "of wave energy before it reaches the shore. This function protects coastal communities "
                        "from storm damage, flooding, and erosion. The global economic value of this coastal "
                        "protection service has been estimated at nine billion dollars per year.\n\n"
                        "Coral reefs also support fisheries that provide food and livelihoods for millions of people. "
                        "An estimated five hundred million people worldwide depend on coral reef fisheries "
                        "for their primary source of protein and income. In Southeast Asia alone, coral reef "
                        "fisheries contribute approximately 2.4 billion dollars to the regional economy each year.\n\n"
                        "The tourism value of coral reefs is also immense. Reef-based tourism, including diving, "
                        "snorkelling, and recreational fishing, generates billions of dollars in revenue annually. "
                        "The Great Barrier Reef alone contributes an estimated six point four billion dollars "
                        "to the Australian economy each year and supports approximately sixty-four thousand jobs.\n\n"
                        "However, coral reefs are among the most threatened ecosystems on Earth. Climate change "
                        "is the single greatest threat. Rising ocean temperatures cause coral bleaching, "
                        "a process in which the coral expels its symbiotic algae in response to thermal stress. "
                        "Without the zooxanthellae, the coral loses its primary food source and its colour, "
                        "appearing white or ghostly. If temperatures return to normal relatively quickly, "
                        "the coral can recover and re-establish its relationship with the algae. However, "
                        "prolonged or severe bleaching events lead to coral death.\n\n"
                        "Ocean acidification, caused by the absorption of excess atmospheric carbon dioxide "
                        "into seawater, is another significant threat. As the ocean becomes more acidic, "
                        "it becomes more difficult for corals to build their calcium carbonate skeletons. "
                        "Studies have shown that coral growth rates have declined by approximately fifteen to "
                        "twenty percent in some reef systems over the past century.\n\n"
                        "Other threats include overfishing, which disrupts the ecological balance of reef "
                        "communities; sedimentation from coastal development and agriculture, which smothers "
                        "coral; and pollution, particularly nutrient runoff from farms which promotes algal "
                        "growth that competes with coral for space and light.\n\n"
                        "Efforts to conserve and restore coral reefs are underway worldwide. Marine protected "
                        "areas, where fishing and other extractive activities are restricted, have been shown "
                        "to improve reef health. Coral restoration programmes, which involve growing coral "
                        "in nurseries and transplanting them onto degraded reefs, are also gaining traction. "
                        "Research into breeding heat-resistant coral varieties may offer hope for reefs "
                        "in a warming world. Thank you."
                    ),
                    "order": 4,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "What percentage of all known marine species do coral reefs support?",
                            "options": ["10 percent", "15 percent", "25 percent", "40 percent"],
                            "correct": ["25 percent"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "What is the name of the microscopic algae that live within coral tissues?",
                            "correct": ["zooxanthellae"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What percentage of wave energy do healthy coral reefs dissipate?",
                            "options": ["75 percent", "85 percent", "90 percent", "97 percent"],
                            "correct": ["97 percent"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Coral reefs cover approximately five percent of the ocean floor.",
                            "correct": ["FALSE"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "How many people worldwide depend on coral reef fisheries for protein and income?",
                            "correct": ["500 million", "five hundred million"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The Great Barrier Reef contributes an estimated $______ billion to the Australian economy each year.",
                            "correct": ["6.4", "6.4 billion", "six point four"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "matching_headings",
                            "text": "Match each threat to coral reefs with its correct description. Coral bleaching",
                            "options": [
                                "Corals expel symbiotic algae due to thermal stress",
                                "Ocean becomes more acidic, hindering skeleton growth",
                                "Algal growth smothers coral",
                                "Sediment covers coral from coastal development"
                            ],
                            "correct": ["Corals expel symbiotic algae due to thermal stress"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "By how much have coral growth rates declined in some reef systems over the past century?",
                            "options": ["5 to 10 percent", "10 to 15 percent", "15 to 20 percent", "25 to 30 percent"],
                            "correct": ["15 to 20 percent"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Coral restoration programmes involve growing coral in nurseries and transplanting them onto degraded reefs.",
                            "correct": ["TRUE"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "The global economic value of the coastal protection service provided by coral reefs has been estimated at $______ billion per year.",
                            "correct": ["9", "nine"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                }
            ]
        },
        {
            "type": "reading",
            "order": 2,
            "time_limit": 60,
            "title": "Reading",
            "passages": [
                {
                    "title": "Passage 1: Soil Microbiomes",
                    "text": (
                        "Beneath our feet lies one of the most complex and least understood ecosystems on the planet. "
                        "A single teaspoon of healthy soil can contain up to one billion bacteria, several hundred "
                        "metres of fungal threads, and thousands of species of microorganisms. This vast underground "
                        "community, collectively known as the soil microbiome, plays a fundamental role in sustaining "
                        "life on Earth. From cycling nutrients and decomposing organic matter to protecting plants "
                        "from disease and even influencing the global climate, soil microorganisms are indispensable "
                        "to both natural ecosystems and human agriculture.\n\n"
                        "The study of soil microbiomes has been transformed in recent years by advances in DNA "
                        "sequencing technology. Traditional methods of studying soil microbes involved culturing "
                        "them in the laboratory, a painstaking process that could identify only a tiny fraction "
                        "of the species present. It was long recognised that the vast majority of soil microbes "
                        "could not be cultured using standard techniques. The development of metagenomics, "
                        "which involves extracting and sequencing all the DNA directly from an environmental sample, "
                        "has allowed scientists to bypass this limitation entirely. For the first time, researchers "
                        "can identify and study the full diversity of organisms present in a soil sample without "
                        "needing to grow any of them in the lab.\n\n"
                        "One of the most important groups of organisms in the soil microbiome is fungi, "
                        "particularly a group known as mycorrhizal fungi. These fungi form symbiotic associations "
                        "with the roots of approximately ninety percent of all plant species. In this partnership, "
                        "the fungi extend their thread-like hyphae far into the surrounding soil, effectively "
                        "increasing the surface area of the plant's root system by up to a thousand times. "
                        "The fungi absorb water and essential nutrients, particularly phosphorus, from the soil "
                        "and transfer them to the plant. In return, the plant provides the fungi with carbon "
                        "in the form of sugars produced through photosynthesis.\n\n"
                        "Recent research has revealed that mycorrhizal networks are even more complex than "
                        "previously understood. Trees and other plants in a forest are connected by vast "
                        "underground fungal networks, sometimes called the wood wide web, through which they "
                        "can share nutrients and even chemical signals. When a tree is attacked by insects, "
                        "for example, it can send chemical warning signals through the mycorrhizal network "
                        "to neighbouring trees, allowing them to pre-emptively activate their defence mechanisms. "
                        "This finding has fundamentally changed our understanding of forest ecology, suggesting "
                        "that forests function not as collections of individual trees but as highly interconnected "
                        "superorganisms.\n\n"
                        "Bacteria are the other major component of the soil microbiome. Soil bacteria perform "
                        "an enormous range of functions. Some decompose organic matter, releasing nutrients "
                        "that plants can absorb. Others fix atmospheric nitrogen, converting it into a form "
                        "that plants can use. Nitrogen-fixing bacteria in the genus Rhizobium, for example, "
                        "form nodules on the roots of leguminous plants such as peas and beans, providing "
                        "these plants with a direct source of nitrogen. This is one reason why crop rotation "
                        "systems that include legumes have been practiced by farmers for thousands of years.\n\n"
                        "Other soil bacteria produce antibiotics and other antimicrobial compounds that suppress "
                        "plant pathogens. The bacterium Bacillus subtilis, which is commonly found in agricultural "
                        "soils, produces a range of compounds that inhibit the growth of harmful fungi and bacteria. "
                        "This natural disease suppression is one of the benefits of maintaining a diverse "
                        "and healthy soil microbiome.\n\n"
                        "Unfortunately, modern agricultural practices have significantly degraded soil microbiomes. "
                        "The intensive use of chemical fertilisers, pesticides, and herbicides has been shown "
                        "to reduce microbial diversity in agricultural soils. Tillage, the practice of ploughing "
                        "and turning the soil, disrupts fungal networks and can reduce populations of beneficial "
                        "microorganisms. Studies have found that organically managed soils typically harbour "
                        "thirty to forty percent more microbial species than conventionally managed soils.\n\n"
                        "There is growing interest in harnessing the soil microbiome to improve agricultural "
                        "productivity sustainably. Biofertilisers, which contain live microorganisms that promote "
                        "plant growth, are an increasingly popular alternative to chemical fertilisers. "
        "Microbial inoculants, which introduce beneficial bacteria or fungi into the soil, have been shown "
                        "to improve crop yields by ten to twenty percent in some trials. Understanding and managing "
                        "the soil microbiome may be one of the keys to feeding the world's growing population "
                        "without further degrading the ecosystems upon which we depend."
                    ),
                    "order": 1,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "How many bacteria can a single teaspoon of healthy soil contain?",
                            "options": ["Up to one million", "Up to ten million", "Up to one hundred million", "Up to one billion"],
                            "correct": ["Up to one billion"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What technology has transformed the study of soil microbiomes?",
                            "options": [
                                "Electron microscopy",
                                "DNA sequencing and metagenomics",
                                "X-ray crystallography",
                                "Radio carbon dating"
                            ],
                            "correct": ["DNA sequencing and metagenomics"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Mycorrhizal fungi form associations with approximately fifty percent of all plant species.",
                            "correct": ["FALSE"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "By how much can mycorrhizal hyphae increase a plant's root surface area?",
                            "correct": ["up to a thousand times", "1000 times"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "matching_headings",
                            "text": "Match each group of soil organisms with its key function. Rhizobium bacteria",
                            "options": [
                                "Decompose organic matter",
                                "Fix atmospheric nitrogen for plants",
                                "Produce antibiotic compounds",
                                "Form underground communication networks"
                            ],
                            "correct": ["Fix atmospheric nitrogen for plants"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "How much more microbial species do organically managed soils harbour compared to conventionally managed soils?",
                            "options": ["10 to 20 percent more", "20 to 30 percent more", "30 to 40 percent more", "50 to 60 percent more"],
                            "correct": ["30 to 40 percent more"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Tillage helps preserve fungal networks in soil.",
                            "correct": ["FALSE"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "By how much can microbial inoculants improve crop yields in some trials?",
                            "options": ["5 to 10 percent", "10 to 20 percent", "20 to 30 percent", "30 to 40 percent"],
                            "correct": ["10 to 20 percent"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "What term is used to describe the underground fungal networks connecting trees?",
                            "correct": ["wood wide web", "mycorrhizal networks"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "The bacterium ______ subtilis produces compounds that inhibit harmful fungi and bacteria.",
                            "correct": ["Bacillus"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Passage 2: Quantum Computing and Cryptography",
                    "text": (
                        "The advent of quantum computing represents a paradigm shift in computational science, "
                        "one that promises to solve problems which are currently intractable for even the most "
                        "powerful classical supercomputers. Yet this extraordinary potential brings with it "
                        "a profound threat: the capacity of quantum computers to break the cryptographic systems "
                        "that protect the vast majority of digital communications and financial transactions. "
                        "Understanding the relationship between quantum computing and cryptography is therefore "
                        "not merely an academic exercise; it is a matter of urgent practical importance.\n\n"
                        "To appreciate why quantum computing poses such a threat to cryptography, it is necessary "
                        "to understand the fundamental difference between classical and quantum computation. "
                        "A classical computer processes information using bits, each of which exists in one of "
                        "two definite states: zero or one. A quantum computer, by contrast, uses quantum bits, "
                        "or qubits, which can exist in a superposition of both states simultaneously. "
                        "This property, combined with quantum entanglement, a phenomenon in which the states "
                        "of multiple qubits become correlated in ways that have no classical equivalent, "
                        "allows quantum computers to process certain types of problems exponentially faster "
                        "than classical machines.\n\n"
                        "The specific threat to cryptography comes from an algorithm developed by the mathematician "
                        "Peter Shor in 1994. Shor's algorithm demonstrated that a sufficiently powerful quantum "
                        "computer could efficiently factor very large numbers, a task that is practically impossible "
                        "for classical computers. This is directly relevant to cryptography because the security "
                        "of RSA encryption, the most widely used public-key cryptographic system, relies on "
                        "the difficulty of factoring the product of two very large prime numbers. A classical "
                        "computer would need billions of years to factor the numbers used in current RSA-2048 "
                        "encryption. A quantum computer running Shor's algorithm could theoretically accomplish "
                        "this in a matter of hours.\n\n"
                        "The implications are staggering. RSA encryption protects everything from online banking "
                        "and email to government communications and military secrets. If a quantum computer "
                        "powerful enough to run Shor's algorithm were built, all of these systems would become "
                        "vulnerable. Perhaps more concerning is the harvesting now, decrypt later threat, "
                        "in which hostile actors intercept and store encrypted communications today with the "
                        "intention of decrypting them once a sufficiently powerful quantum computer becomes "
                        "available. Because encrypted data may remain sensitive for decades, this threat "
                        "is not hypothetical; it is already potentially underway.\n\n"
                        "The race to develop a cryptographically relevant quantum computer is being pursued "
                        "by governments and corporations worldwide. IBM, Google, and several Chinese research "
                        "institutions have made significant progress. In 2019, Google claimed to have achieved "
                        "quantum supremacy, demonstrating that their fifty-three-qubit Sycamore processor could "
                        "perform a specific calculation in two hundred seconds that would take the world's most "
                        "powerful classical supercomputer approximately ten thousand years. While the practical "
                        "significance of this particular calculation was debated, it demonstrated that quantum "
                        "computers are rapidly advancing towards the threshold where they could threaten "
                        "cryptographic systems.\n\n"
                        "The cryptographic community has been preparing for this eventuality for some time. "
                        "The most promising response is the development of post-quantum cryptography, "
                        "a new generation of cryptographic algorithms that are designed to be resistant "
                        "to both classical and quantum attacks. In 2022, the United States National Institute "
                        "of Standards and Technology announced the selection of four post-quantum cryptographic "
                        "algorithms for standardisation. These algorithms are based on mathematical problems "
                        "that are believed to be hard for both classical and quantum computers to solve, "
                        "such as lattice-based and code-based cryptographic schemes.\n\n"
                        "The transition to post-quantum cryptography will be one of the largest and most "
                        "complex infrastructure upgrades in the history of computing. Every system that currently "
                        "uses RSA or related cryptographic standards will need to be updated. This includes "
                        "web browsers, email systems, virtual private networks, banking platforms, and "
                        "government communication networks. The process could take a decade or more, "
                        "which is why many experts believe that the transition should begin now, even though "
                        "a cryptographically relevant quantum computer may still be years away.\n\n"
                        "Quantum key distribution offers another approach to quantum-safe communication. "
                        "This technology uses the principles of quantum mechanics to allow two parties to share "
                        "a secret encryption key with security guaranteed by the laws of physics. Any attempt "
                        "to intercept or eavesdrop on the key exchange will inevitably disturb the quantum "
                        "states involved, alerting the communicating parties to the presence of an intruder. "
                        "While QKD systems have been successfully demonstrated over distances of several hundred "
                        "kilometres using both fiber optic cables and satellite links, they currently require "
                        "specialised and expensive hardware, which limits their practical deployment.\n\n"
                        "The quantum computing revolution is not a distant prospect; it is an approaching "
                        "reality that demands proactive preparation. The nations, companies, and individuals "
                        "who act now to understand and mitigate the cryptographic risks will be best positioned "
                        "to navigate the transition securely."
                    ),
                    "order": 2,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "What type of bits do classical computers use?",
                            "options": ["Qubits", "Trinary bits", "Bits with two definite states", "Photonic bits"],
                            "correct": ["Bits with two definite states"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "Who developed the algorithm that threatens RSA encryption?",
                            "correct": ["Peter Shor"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What does RSA encryption rely on for its security?",
                            "options": [
                                "The speed of light",
                                "The difficulty of factoring large numbers",
                                "Quantum entanglement",
                                "The uncertainty principle"
                            ],
                            "correct": ["The difficulty of factoring large numbers"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Google claimed quantum supremacy in 2019 with their Sycamore processor.",
                            "correct": ["TRUE"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "How many qubits did Google's Sycamore processor have?",
                            "options": ["23", "33", "43", "53"],
                            "correct": ["53"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "Which organisation announced the selection of post-quantum cryptographic algorithms for standardisation?",
                            "options": [
                                "The European Central Bank",
                                "The United States National Institute of Standards and Technology",
                                "The International Monetary Fund",
                                "The United Nations"
                            ],
                            "correct": ["The United States National Institute of Standards and Technology"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Post-quantum cryptographic algorithms are based on lattice-based and code-based schemes.",
                            "correct": ["TRUE"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "Quantum key distribution uses the principles of ______ mechanics to guarantee key security.",
                            "correct": ["quantum"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What is the harvesting now, decrypt later threat?",
                            "options": [
                                "Storing quantum data for future analysis",
                                "Intercepting encrypted communications now to decrypt with future quantum computers",
                                "Harvesting data from quantum experiments",
                                "Collecting encryption keys from multiple sources"
                            ],
                            "correct": ["Intercepting encrypted communications now to decrypt with future quantum computers"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "The transition to post-quantum cryptography could take a ______ or more.",
                            "correct": ["decade"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Passage 3: Traditional Japanese Farming",
                    "text": (
                        "In an era dominated by industrial agriculture and genetic engineering, the traditional "
                        "farming systems of Japan offer a remarkable counterexample of how food production "
                        "can be organised in harmony with natural ecosystems. Developed over more than a thousand "
                        "years of careful observation and incremental innovation, Japanese traditional agriculture "
                        "embodies principles of sustainability, biodiversity, and community cooperation that are "
                        "increasingly relevant to the challenges facing modern food systems.\n\n"
                        "At the heart of traditional Japanese agriculture is the concept of satoyama, a term "
                        "that refers to the managed landscape between the mountain wilderness and the flat "
                        "cultivated plains. Satoyama landscapes are characterised by a mosaic of rice paddies, "
                        "vegetable plots, woodlots, irrigation ponds, and hedgerows, all managed in an integrated "
                        "manner that supports both human needs and ecological health. For centuries, satoyama "
                        "landscapes covered much of rural Japan, providing food, fuel, timber, and medicinal "
                        "plants while maintaining extraordinarily high levels of biodiversity.\n\n"
                        "Rice cultivation is the cornerstone of traditional Japanese agriculture, and the paddy "
                        "field, or tanbo, is perhaps the most iconic element of the Japanese rural landscape. "
                        "Traditional rice cultivation in Japan involves a remarkably complex system of water "
                        "management. Paddy fields are flooded to a depth of five to ten centimetres during "
                        "the growing season, creating a shallow wetland habitat that supports a rich community "
                        "of organisms, including frogs, dragonflies, aquatic beetles, and numerous species "
                        "of water plants. This deliberate creation of wetland habitat through agricultural "
                        "practice is a striking example of how traditional farming can enhance rather than "
                        "diminish biodiversity.\n\n"
                        "One of the most distinctive features of traditional Japanese rice cultivation is the "
                        "practice of aigamo farming, the simultaneous rearing of ducks within rice paddies. "
                        "In this system, which was revived in the 1990s based on ancient practices, groups of "
                        "fifteen to twenty ducks are released into the flooded paddy after the rice seedlings "
                        "have been planted. The ducks feed on insects, snails, and weeds, reducing the need "
                        "for chemical pesticides and herbicides. Their droppings provide a natural fertiliser, "
                        "reducing the need for synthetic inputs. Research has shown that aigamo farming can "
                        "reduce insect pest populations by up to seventy percent and weed growth by up to "
                        "sixty percent, while maintaining rice yields comparable to conventional methods.\n\n"
                        "Traditional Japanese agriculture also includes sophisticated systems of crop rotation "
                        "and intercropping. The inagawara system, practiced in parts of the Kanto region, "
                        "involves rotating rice with dry-field crops such as soybeans, wheat, and vegetables "
                        "in a carefully planned sequence that maintains soil fertility and breaks pest and "
                        "disease cycles. This rotation system, combined with the application of composted "
                        "organic matter, has sustained soil productivity in some areas for centuries without "
                        "the need for chemical fertilisers.\n\n"
                        "Community cooperation is another defining feature of traditional Japanese agriculture. "
                        "The yui system, a form of reciprocal labour exchange, ensured that demanding tasks "
                        "such as rice planting and harvesting could be completed efficiently. During the "
                        "planting season, neighbouring families would work together on each other's fields "
                        "in turn, sharing both labour and knowledge. This system not only increased "
                        "productivity but also strengthened social bonds and facilitated the transmission "
                        "of agricultural knowledge across generations.\n\n"
                        "Water management in traditional Japanese agriculture was equally impressive. "
                        "Irrigation systems, including elaborate networks of canals, sluice gates, and "
                        "retention ponds, were collectively maintained by farming communities. The design "
                        "and maintenance of these systems required sophisticated engineering knowledge "
                        "and long-term planning. Many of these irrigation systems have been in continuous "
                        "use for hundreds of years and are still functioning today.\n\n"
                        "However, traditional Japanese farming faces severe challenges. The ageing of the "
                        "farming population is perhaps the most pressing. The average age of Japanese farmers "
                        "is now over sixty-seven, and young people are increasingly reluctant to take up "
                        "farming as a career. Government statistics show that the number of farming households "
                        "in Japan has declined from approximately six million in 1960 to less than two million "
                        "today. As farms are abandoned, the carefully managed satoyama landscapes are reverting "
                        "to unmanaged woodland or being converted to residential development, with significant "
                        "losses of both cultural heritage and biodiversity.\n\n"
                        "Despite these challenges, there is a growing movement to revitalise traditional "
                        "Japanese agriculture. Young farmers, often inspired by environmental values, "
                        "are establishing small-scale organic farms that incorporate traditional practices. "
                        "The Japanese government has introduced support programmes for new farmers, "
                        "including subsidies, training programmes, and land-use arrangements. "
                        "International interest in Japanese traditional farming methods has also grown, "
                        "with researchers and practitioners from around the world studying satoyama "
                        "management and aigamo farming as models for sustainable agriculture. "
                        "The challenge lies in finding ways to adapt these traditional practices to modern "
                        "economic realities while preserving the ecological and cultural values that make them "
                        "so valuable."
                    ),
                    "order": 3,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "What does the term satoyama refer to?",
                            "options": [
                                "A type of rice variety",
                                "The managed landscape between mountain wilderness and cultivated plains",
                                "A traditional irrigation system",
                                "A method of crop rotation"
                            ],
                            "correct": ["The managed landscape between mountain wilderness and cultivated plains"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "How deep are rice paddies flooded during the growing season?",
                            "correct": ["5 to 10 centimetres", "five to ten centimetres"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "How many ducks are typically released in an aigamo farming system?",
                            "options": ["5 to 10", "10 to 15", "15 to 20", "25 to 30"],
                            "correct": ["15 to 20"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Aigamo farming can reduce insect pest populations by up to seventy percent.",
                            "correct": ["TRUE"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "matching_headings",
                            "text": "Match each traditional Japanese farming concept with its correct description. Yui system",
                            "options": [
                                "Rotating rice with dry-field crops",
                                "Reciprocal labour exchange between families",
                                "Releasing ducks into rice paddies",
                                "Collective irrigation maintenance"
                            ],
                            "correct": ["Reciprocal labour exchange between families"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What is the current average age of Japanese farmers?",
                            "options": ["Over 50", "Over 57", "Over 67", "Over 75"],
                            "correct": ["Over 67"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "The number of farming households in Japan has declined from approximately six million in ______ to less than two million today.",
                            "correct": ["1960"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Traditional rice paddies support biodiversity by creating wetland habitats.",
                            "correct": ["TRUE"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "Which crops are rotated with rice in the inagawara system?",
                            "options": [
                                "Rice and barley only",
                                "Soybeans, wheat, and vegetables",
                                "Corn and sunflowers",
                                "Tea and mulberry"
                            ],
                            "correct": ["Soybeans, wheat, and vegetables"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "Aigamo farming can reduce weed growth by up to ______ percent.",
                            "correct": ["60", "sixty"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                }
            ]
        },
        {
            "type": "writing",
            "order": 3,
            "time_limit": 60,
            "title": "Writing",
            "standalone_questions": [
                {
                    "type": "writing_task",
                    "text": "Task 1: The diagram below shows the stages in a municipal water treatment process, from the initial collection of raw water to the supply of clean drinking water to homes and businesses. Summarise the information by selecting and reporting the main stages. Write at least 150 words.",
                    "prompt_text": "Task 1",
                    "correct": [],
                    "order": 1,
                    "marks": 0,
                    "time_limit_minutes": 20
                },
                {
                    "type": "writing_task",
                    "text": "Task 2: Some people believe that technology has made education more accessible and effective, while others argue that it has created new barriers to learning and reduced the quality of education. Discuss both views and give your own opinion. Write at least 250 words.",
                    "prompt_text": "Task 2",
                    "correct": [],
                    "order": 2,
                    "marks": 0,
                    "time_limit_minutes": 40
                }
            ]
        },
        {
            "type": "speaking",
            "order": 4,
            "time_limit": 15,
            "title": "Speaking",
            "standalone_questions": [
                {
                    "type": "speaking_task",
                    "text": "Part 1: Introduction. The examiner will ask you general questions about yourself, your hometown, your hobbies, and what you do in your free time.",
                    "prompt_text": "Introduction",
                    "correct": [],
                    "order": 1,
                    "marks": 0
                },
                {
                    "type": "speaking_task",
                    "text": "Part 2: Cue Card. Describe a natural landscape or place of natural beauty that you have seen. You should say: where it was, what it looked like, when you saw it, and explain how it made you feel or why it impressed you.",
                    "prompt_text": "Cue Card",
                    "cue_card": {
                        "topic": "Describe a natural landscape or place of natural beauty that you have seen",
                        "points": [
                            "where it was",
                            "what it looked like",
                            "when you saw it",
                            "explain how it made you feel or why it impressed you"
                        ]
                    },
                    "correct": [],
                    "order": 2,
                    "marks": 0,
                    "time_limit_minutes": 2
                },
                {
                    "type": "speaking_task",
                    "text": "Part 3: Discussion. The examiner will ask you more abstract questions about the environment and policy. Questions may include: What environmental policies has your government implemented recently? Do you think individuals have a responsibility to protect the environment, or should it be left to governments? How can developing countries balance economic growth with environmental protection?",
                    "prompt_text": "Discussion",
                    "correct": [],
                    "order": 3,
                    "marks": 0
                }
            ]
        }
    ]
}
