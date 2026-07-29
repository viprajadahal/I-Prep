MOCK_TEST = {
    "title": "Full IELTS Academic Test #1",
    "description": "A complete IELTS Academic practice test featuring sections on holiday accommodation, university life, research methods, urban planning, decision fatigue, vertical farming, and whale communication.",
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
                    "title": "Section 1: Holiday Accommodation Conversation",
                    "text": (
                        "W: Good morning, Seaside Retreats Holiday Bookings. My name is Fiona. How can I help you today?\n"
                        "M: Hello, Fiona. My name is Daniel Hargreaves. I was hoping to book a cottage for a family holiday "
                        "in August. We have been before, about three years ago, and we really enjoyed it.\n"
                        "W: That is lovely to hear, Mr Hargreaves. Do you remember which cottage you stayed in last time? "
                        "We have several along the coast.\n"
                        "M: I believe it was the one called Driftwood Cottage. It had a wonderful view of the harbour, "
                        "and it was just a short walk from the beach.\n"
                        "W: Ah yes, Driftwood Cottage. That is one of our most popular properties, I am afraid. "
                        "It is already booked for most of August. However, I can check availability for you. "
                        "What dates were you thinking of?\n"
                        "M: We would like to arrive on the fourteenth of August and stay until the twenty-first. "
                        "That would be one week. There are four of us altogether: my wife, our two children, and myself. "
                        "The children are eight and eleven years old.\n"
                        "W: Let me just check the system. The fourteenth to the twenty-first of August... "
                        "Unfortunately, Driftwood Cottage is occupied from the tenth through to the twenty-eighth. "
                        "However, we do have another property very nearby called Harbour View. "
                        "It is slightly larger and has three bedrooms instead of two. It also has a small garden "
                        "which is enclosed, so it is safe for children.\n"
                        "M: That sounds promising. What would the cost be for one week?\n"
                        "W: For Harbour View in peak season, the rate is nine hundred and seventy-five pounds "
                        "for a full week. That includes all utilities, bed linen, and towels. "
                        "There is an additional cleaning fee of forty-five pounds.\n"
                        "M: I see. And is there parking available?\n"
                        "W: Yes, each cottage has its own allocated parking space. Harbour View has one space "
                        "directly in front of the property. If you need an additional space, there is a public "
                        "car park about two hundred metres away which costs five pounds per day.\n"
                        "M: That is fine. We will only have one car. What is included in terms of kitchen facilities? "
                        "My wife is quite particular about cooking.\n"
                        "W: The kitchen is fully equipped. There is an electric oven and hob, a microwave, "
                        "a dishwasher, a fridge-freezer, and a washing machine. There is also a cafetiere, "
                        "a toaster, and a kettle. We provide a basic supply of tea, coffee, sugar, and milk "
                        "for your arrival, just so you do not have to rush to the shops immediately.\n"
                        "M: That is very thoughtful. How do we go about making the booking?\n"
                        "W: I will need a deposit of two hundred pounds to secure the reservation. "
                        "The remaining balance of eight hundred and twenty pounds would need to be paid "
                        "no later than six weeks before your arrival date, which would be the first of July. "
        "We accept payment by bank transfer or credit card. I can send you the details by email.\n"
                        "M: Perfect. Could you also tell me about cancellation policies?\n"
                        "W: If you cancel more than eight weeks before your arrival date, you will receive "
                        "a full refund minus a thirty-pound administrative fee. If you cancel between four "
                        "and eight weeks before, you forfeit fifty percent of the total cost. "
                        "Cancellations within four weeks of arrival are non-refundable. "
                        "We strongly recommend that you take out holiday cancellation insurance.\n"
                        "M: That is quite standard. One more question: are pets allowed?\n"
                        "W: We do allow dogs in certain properties, but unfortunately Harbour View is not "
                        "one of them. We have two cottages that are pet-friendly: Pine Lodge and Meadow Cottage. "
                        "Would you like me to check availability for either of those instead?\n"
                        "M: No, that is not a problem. We do not have a pet. I think Harbour View sounds ideal. "
                        "Shall I give you my card details now?\n"
                        "W: Yes, if you are ready. I will just need the card number, the expiry date, "
                        "and the three-digit security code on the back. I will also need a contact email address "
                        "and a mobile number for the duration of your stay.\n"
                        "M: My email is d dot hargreaves at mail dot com, and my mobile is 07944 332 187. "
                        "The card number is 4532 8701 2244 6618, expiry is 09/27, and the security code is 482.\n"
                        "W: Thank you, Mr Hargreaves. I have processed the deposit of two hundred pounds. "
                        "You will receive a confirmation email within the next ten minutes with all the details, "
                        "including directions to the property and the key collection instructions.\n"
                        "M: Wonderful. Thank you very much for your help, Fiona.\n"
                        "W: My pleasure. I hope you and your family have a wonderful holiday. Goodbye."
                    ),
                    "order": 1,
                    "questions": [
                        {
                            "type": "form_completion",
                            "text": "The caller wants to book accommodation from the ______ to the ______ of August.",
                            "correct": ["fourteenth", "twenty-first"],
                            "order": 1,
                            "marks": 2
                        },
                        {
                            "type": "form_completion",
                            "text": "There will be ______ people staying at the cottage.",
                            "correct": ["4", "four"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The alternative cottage is called ______.",
                            "correct": ["Harbour View"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The cost for one week is £______.",
                            "correct": ["975"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The cleaning fee is £______.",
                            "correct": ["45"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The deposit required is £______.",
                            "correct": ["200"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The remaining balance must be paid by the ______ of ______.",
                            "correct": ["first", "July"],
                            "order": 7,
                            "marks": 2
                        },
                        {
                            "type": "form_completion",
                            "text": "The cancellation fee for a full refund is £______.",
                            "correct": ["30"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "The guest's email address is d.hargreaves@mail.com and mobile number is 07944 ______.",
                            "correct": ["332187"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "form_completion",
                            "text": "The security code on the credit card is ______.",
                            "correct": ["482"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Section 2: University Campus Tour",
                    "text": (
                        "Good morning, everyone, and welcome to Greenfield University. My name is Dr Catherine Bellamy, "
                        "and I am the Student Welfare Officer here. I will be giving you a tour of the campus today, "
                        "but before we set off, I would like to take a few minutes to tell you about some of the "
                        "key facilities and services available to you as students.\n\n"
                        "First of all, let me point out where we are standing. This is the Main Atrium, which is "
                        "the central hub of the campus. Directly ahead of you is the Student Information Desk, "
                        "where staff can help with everything from enrolment queries to lost student cards. "
                        "It is open from eight-thirty in the morning until six in the evening on weekdays, "
                        "and from ten until two on Saturdays.\n\n"
                        "Now, if you look to your left, you will see a large glass-fronted building. "
                        "That is the Whitfield Library. It was completely renovated three years ago and now houses "
                        "over two hundred thousand volumes across four floors. The ground floor is what we call "
                        "the Collaborative Zone, where group study rooms can be booked in two-hour blocks. "
        "The upper floors are silent study areas, and the top floor contains a special collections room "
                        "with rare manuscripts and historical documents. The library is open twenty-four hours "
                        "a day during term time, and there is a twenty-four-hour security presence as well.\n\n"
                        "Moving on, the building directly behind the library is the Student Union. "
                        "The Union runs over sixty student societies, from the Debating Society to the Quidditch "
                        "Society, so there really is something for everyone. The ground floor of the Union building "
                        "contains the campus shop, which stocks groceries, stationery, and university-branded clothing. "
                        "There is also a pharmacy on the far side of the ground floor. The first floor has "
                        "the main bar and a pizza restaurant, both of which are popular social spots in the evenings.\n\n"
                        "If we walk through the courtyard here, you will see the Sports Centre on the right. "
                        "The Sports Centre has a swimming pool, a fully equipped gym, four squash courts, "
                        "and a large sports hall used for basketball, badminton, and volleyball. Membership of "
                        "the Sports Centre is included in your student fees, so you do not need to pay extra. "
                        "There are also outdoor tennis courts and a football pitch at the rear of the building. "
                        "Fitness classes such as yoga, spinning, and aerobics run throughout the week, "
                        "and schedules can be found on the university app.\n\n"
                        "Now, for those of you studying sciences, the Huxley Building, which we will pass "
                        "in a moment, is where all the laboratory-based teaching takes place. It contains "
                        "twelve state-of-the-art laboratories, including a robotics lab, a marine biology lab "
                        "with its own saltwater aquarium, and a pharmaceutical sciences lab. The basement of "
                        "the Huxley Building also houses the Maker Space, which is open to all students "
                        "regardless of their discipline. It has three-dimensional printers, laser cutters, "
                        "electronics workbenches, and even a small recording studio.\n\n"
                        "The building on the far left of the campus is Morrison Hall, which is the main catering "
                        "facility. It serves breakfast, lunch, and dinner every day during term time, "
                        "with a wide range of options including vegetarian, vegan, halal, and gluten-free meals. "
                        "Prices are subsidised for students, so a main course typically costs between three "
                        "and five pounds. There is also a Costa Coffee outlet just inside the entrance for those "
                        "who need a caffeine fix between lectures.\n\n"
                        "Finally, I would like to mention the Wellbeing Centre, which is located in a small "
                        "building just behind Morrison Hall. The Wellbeing Centre offers free counselling services, "
                        "academic skills workshops, and support for students with disabilities or specific learning "
                        "difficulties. Everything you discuss with the Wellbeing Centre is completely confidential. "
                        "I strongly encourage all of you to visit during your first week to register, "
                        "even if you do not think you need any support at the moment.\n\n"
                        "Right, that concludes my introduction. If you have any questions, please feel free to ask "
                        "as we walk around. Shall we start with the library?"
                    ),
                    "order": 2,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "What is the role of Dr Catherine Bellamy?",
                            "options": ["Student Welfare Officer", "Head Librarian", "Student Union President", "Campus Director"],
                            "correct": ["Student Welfare Officer"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "The Whitfield Library was renovated how many years ago?",
                            "options": ["two years ago", "three years ago", "five years ago", "ten years ago"],
                            "correct": ["three years ago"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "The library is open twenty-four hours a day throughout the entire year.",
                            "correct": ["FALSE"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "How many student societies does the Union run?",
                            "options": ["over thirty", "over forty", "over fifty", "over sixty"],
                            "correct": ["over sixty"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "The campus shop sells groceries, stationery, and technology equipment.",
                            "correct": ["FALSE"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Students must pay an additional fee to use the Sports Centre.",
                            "correct": ["FALSE"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "How many squash courts does the Sports Centre have?",
                            "correct": ["4", "four"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "The marine biology laboratory has a freshwater aquarium.",
                            "correct": ["FALSE"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "A main course at Morrison Hall typically costs between £3 and £______.",
                            "correct": ["5"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "The Wellbeing Centre offers free and confidential support to students.",
                            "correct": ["TRUE"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Section 3: Research Methods Discussion",
                    "text": (
                        "Professor: Right, Sarah and James, thank you for coming to discuss your dissertation proposals. "
                        "I have read through both of your outlines, and I have some comments and suggestions. "
                        "Shall we start with yours, Sarah? Can you give me a brief overview of what you are planning?\n\n"
                        "Sarah: Of course. My research looks at how social media usage affects body image "
                        "satisfaction among female university students. I plan to distribute an online questionnaire "
                        "to approximately three hundred students across three universities in the region. "
                        "The questionnaire will include the Sociocultural Attitudes Towards Appearance Questionnaire, "
                        "which is a validated psychometric scale, along with some demographic questions "
                        "and questions about daily social media screen time.\n\n"
                        "Professor: Thank you. I think the topic is very relevant and timely. "
                        "However, I have a couple of concerns. First, you have mentioned three hundred students, "
                        "but have you thought about how you will achieve that sample size? Response rates for "
                        "online surveys can be quite low, often below thirty percent.\n\n"
                        "Sarah: I had not really considered that. I was hoping to distribute through "
                        "university email lists and social media groups.\n\n"
                        "Professor: That is a reasonable approach, but you should think about incentives. "
                        "Perhaps you could offer a small prize draw, a coffee voucher or something similar. "
                        "I would also suggest that you target at least five hundred potential respondents "
                        "to account for non-responses. My second concern is about the ethical implications. "
                        "Questions about body image can be sensitive. Have you thought about signposting "
                        "support services within the survey itself?\n\n"
                        "Sarah: Yes, I included a brief information sheet at the beginning of the survey "
                        "which provides the contact details for the university counselling service.\n\n"
                        "Professor: Good. I would also recommend including a debrief statement at the end "
                        "and making it clear that participants can skip any question they are uncomfortable "
                        "answering. Now, James, tell me about your project.\n\n"
                        "James: My research examines the impact of open-plan office environments on employee "
                        "productivity and stress levels. I intend to use a mixed-methods approach. "
                        "The quantitative component will involve measuring output rates and error rates "
                        "in two departments of a local company, one that has recently moved to an open-plan "
                        "office and one that still uses traditional cubicles. The qualitative component "
                        "will consist of semi-structured interviews with twelve employees, six from each department.\n\n"
                        "Professor: This is a solid design. The mixed-methods approach will give your findings "
                        "more depth. However, I would urge you to think carefully about access. "
                        "Companies can be reluctant to share productivity data. Have you secured agreement "
                        "from the organisation yet?\n\n"
                        "James: I have a letter of support from the HR director, but she mentioned "
                        "that they would need to anonymise the productivity data before releasing it.\n\n"
                        "Professor: That is perfectly fine, and in fact it is better for ethical purposes. "
        "Make sure that no individual employee can be identified from the data. What about your interview "
                        "sampling strategy? You said six from each department. How will you select those participants?\n\n"
                        "James: I was planning to use purposive sampling to ensure a mix of genders, "
                        "age groups, and job roles.\n\n"
                        "Professor: Excellent. That will help you capture a range of perspectives. "
                        "One piece of advice: when you conduct the interviews, try to use a neutral location, "
                        "perhaps a meeting room away from the office floor. You do not want employees to feel "
                        "as though their colleagues or managers might overhear their responses. "
                        "That could really limit the honesty of your data.\n\n"
                        "James: That is a good point. I will make sure to arrange that.\n\n"
                        "Professor: Right. Both of your projects are off to a good start. "
                        "I want you to draft full ethics applications by the end of next week. "
                        "Use the university template and make sure you address all the points we have discussed today. "
                        "Sarah, pay particular attention to the sensitivity issue. James, make sure your data "
                        "management plan covers anonymisation procedures. Any other questions?"
                    ),
                    "order": 3,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "What is the main topic of Sarah's research?",
                            "options": [
                                "Social media and academic performance",
                                "Social media and body image satisfaction",
                                "Social media addiction among teenagers",
                                "Body image and mental health disorders"
                            ],
                            "correct": ["Social media and body image satisfaction"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "How many students does Sarah originally plan to survey?",
                            "options": ["100", "200", "300", "500"],
                            "correct": ["300"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "What incentive does the professor suggest Sarah offer to increase response rates?",
                            "correct": ["prize draw", "coffee voucher"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Sarah has already included support service details in her survey.",
                            "correct": ["TRUE"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What research design does James plan to use?",
                            "options": [
                                "Quantitative only",
                                "Qualitative only",
                                "Mixed methods",
                                "Case study only"
                            ],
                            "correct": ["Mixed methods"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "How many employees does James plan to interview?",
                            "correct": ["12", "twelve"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What sampling method does James intend to use for his interviews?",
                            "options": [
                                "Random sampling",
                                "Convenience sampling",
                                "Purposive sampling",
                                "Stratified sampling"
                            ],
                            "correct": ["Purposive sampling"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "James has already received ethical approval for his research.",
                            "correct": ["FALSE"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "What does the professor recommend James use as the interview location?",
                            "correct": ["neutral location", "meeting room"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "Both students must submit their ethics applications by the end of next ______.",
                            "correct": ["week"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Section 4: Urban Planning Lecture",
                    "text": (
                        "Good afternoon, everyone. Today's lecture is part of our series on contemporary urban challenges, "
                        "and I will be talking about the concept of the fifteen-minute city. This is an urban planning "
                        "model that has gained considerable attention in recent years, particularly after it was "
                        "championed by Carlos Moreno, a Colombian-French scientist, and subsequently adopted as "
                        "a guiding principle for the city of Paris by Mayor Anne Hidalgo.\n\n"
                        "The fundamental idea behind the fifteen-minute city is relatively straightforward. "
                        "It proposes that all essential services and amenities should be accessible to residents "
                        "within a fifteen-minute walk or bicycle ride from their homes. These services include "
                        "workplaces, shops, healthcare facilities, schools, parks, cultural venues, and leisure "
                        "opportunities. The concept is a departure from the twentieth-century model of urban planning, "
                        "which often separated residential areas from commercial and industrial zones, "
                        "creating sprawling cities where people became heavily dependent on private cars.\n\n"
                        "There are several key principles underpinning the fifteen-minute city. The first is proximity. "
                        "Rather than having a single city centre where all the important functions are concentrated, "
                        "the fifteen-minute city distributes services across multiple neighbourhood hubs. "
                        "This means that a resident should not need to travel to the central business district "
                        "to access quality healthcare, education, or employment.\n\n"
                        "The second principle is diversity. A successful fifteen-minute neighbourhood should offer "
                        "a mix of housing types, from apartments to family homes, and a mix of land uses. "
                        "A street might contain a small supermarket, a dentist, a primary school, a playground, "
                        "and residential units all within the same block. This diversity creates vibrant, "
                        "self-sustaining communities.\n\n"
                        "The third principle is density. For the model to work, neighbourhoods need a certain "
                        "critical mass of population to support local businesses and services. However, this density "
                        "must be balanced with quality of life. Green spaces, trees, and pedestrian-friendly streets "
                        "are essential components.\n\n"
                        "The fourth principle is connectivity. This refers to the quality of infrastructure "
                        "for walking, cycling, and public transport. In practice, it often means reallocating "
                        "road space from cars to wider pavements, protected bicycle lanes, and improved bus or tram routes.\n\n"
                        "Paris has been the most high-profile adopter of this model. Since 2020, the city has "
                        "created over one hundred kilometres of permanent cycle lanes, pedestrianised parts "
                        "of the Seine riverbank, added thousands of trees, and introduced low-emission zones "
                        "that restrict car traffic. Schools have been required to open their playgrounds "
                        "as public green spaces outside school hours, and car parks have been converted "
                        "into community gardens.\n\n"
                        "However, the concept is not without criticism. Some urban planners argue that it oversimplifies "
                        "the complexity of city life. Not everyone works close to home, and many people have "
                        "family or social obligations that require them to travel across a city. There are also "
                        "concerns about equity. Wealthier neighbourhoods often already have good access to services, "
                        "while lower-income areas do not. Simply designating an area as a fifteen-minute neighbourhood "
                        "does not magically create the services and infrastructure that are missing.\n\n"
                        "Another criticism relates to displacement. When a neighbourhood is improved to meet "
                        "the fifteen-minute model, property values often rise, which can push out the very "
                        "residents who were supposed to benefit. This process, sometimes called green gentrification, "
                        "has been observed in several European cities.\n\n"
                        "Despite these challenges, the fifteen-minute city concept has proven to be a powerful "
                        "framework for rethinking how we design urban spaces. It encourages us to prioritise "
                        "people over cars, community over convenience, and sustainability over speed. "
                        "As we face the dual crises of climate change and public health, the fifteen-minute city "
                        "offers a vision of urban life that is healthier, more equitable, and more resilient.\n\n"
                        "In next week's lecture, we will look at case studies from Melbourne, Barcelona, "
                        "and Portland, which have all implemented variations of this model with differing "
                        "degrees of success. I would like you to read chapters seven and eight of the set textbook "
                        "before that session. Thank you very much."
                    ),
                    "order": 4,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "Who first championed the concept of the fifteen-minute city?",
                            "options": [
                                "Anne Hidalgo",
                                "Carlos Moreno",
                                "Jan Gehl",
                                "Le Corbusier"
                            ],
                            "correct": ["Carlos Moreno"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "Which city has been the most high-profile adopter of the fifteen-minute city model?",
                            "options": ["Barcelona", "Melbourne", "Paris", "Portland"],
                            "correct": ["Paris"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "How many kilometres of permanent cycle lanes has Paris created since 2020?",
                            "correct": ["over 100", "over one hundred"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "The fifteen-minute city requires all essential services to be within a ten-minute walk.",
                            "correct": ["FALSE"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "What are schools in Paris required to open as public spaces outside school hours?",
                            "correct": ["playgrounds"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "matching_headings",
                            "text": "Match each principle of the fifteen-minute city with its correct description. Principle: Proximity",
                            "options": [
                                "Distributing services across neighbourhood hubs",
                                "Mixing housing types and land uses",
                                "Ensuring critical population mass",
                                "Improving walking and cycling infrastructure"
                            ],
                            "correct": ["Distributing services across neighbourhood hubs"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What is 'green gentrification'?",
                            "options": [
                                "The conversion of parks into residential areas",
                                "Rising property values pushing out residents after neighbourhood improvements",
                                "The introduction of green building standards",
                                "The expansion of green spaces in city centres"
                            ],
                            "correct": ["Rising property values pushing out residents after neighbourhood improvements"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "The lecturer argues that the fifteen-minute city model has no significant weaknesses.",
                            "correct": ["FALSE"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What will next week's lecture cover?",
                            "options": [
                                "The history of urban planning",
                                "Case studies from Melbourne, Barcelona, and Portland",
                                "Climate change and cities",
                                "The architecture of Paris"
                            ],
                            "correct": ["Case studies from Melbourne, Barcelona, and Portland"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "Students should read chapters ______ and eight of the set textbook before next week.",
                            "correct": ["7", "seven"],
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
                    "title": "Passage 1: Decision Fatigue",
                    "text": (
                        "Every day, the average adult makes approximately thirty-five thousand decisions. From the trivial "
                        "such as what to wear and what to eat for breakfast, to the profoundly significant such as "
                        "whether to change careers or end a relationship, our waking hours are saturated with choices. "
                        "While most people assume that the capacity for rational decision-making remains constant "
                        "throughout the day, a growing body of psychological research suggests otherwise. "
                        "The concept known as decision fatigue proposes that the quality of our decisions deteriorates "
                        "after making a long series of choices, regardless of how important those choices are.\n\n"
                        "The term was popularised by social psychologist Roy Baumeister, whose influential research "
                        "in the late 1990s demonstrated that acts of self-control and decision-making draw upon "
                        "a limited psychological resource. In one of his most cited experiments, Baumeister and his "
                        "colleagues asked participants to solve a series of puzzles. Some participants were first "
                        "asked to resist the temptation of freshly baked cookies and instead eat radishes. "
                        "The group that had to exert willpower to resist the cookies gave up on the puzzles "
                        "significantly earlier than the control group, suggesting that the initial act of "
                        "self-regulation had depleted their mental energy.\n\n"
                        "This finding has profound implications for real-world contexts. Consider the phenomenon "
                        "of judicial decision-making. A widely discussed study published in the Proceedings of "
                        "the National Academy of Sciences examined over one thousand parole decisions made by "
                        " Israeli judges over a ten-month period. The researchers found that the likelihood of "
                        "a favourable ruling dropped dramatically as the time since the judge's last meal increased. "
                        "At the beginning of a session, after a break for food, the approval rate for parole "
                        "was approximately sixty-five percent. By the end of a session, just before the next meal, "
                        "the approval rate fell to nearly zero. The judges were not making deliberate decisions "
                        "to be harsher; rather, their depleted cognitive resources were leading them to default "
                        "to the safest option, which was to deny parole.\n\n"
                        "Similar patterns have been observed in other professional settings. Hospital doctors "
                        "have been found to prescribe more unnecessary antibiotics towards the end of their shifts. "
                        "Car salespeople offer progressively larger discounts as the day wears on. Hiring managers "
                        "become increasingly likely to rely on gut instinct rather than careful evaluation "
                        "of candidates as interview sessions drag on.\n\n"
                        "The neurological basis for decision fatigue appears to involve glucose metabolism in the brain. "
                        "When we make decisions, the prefrontal cortex, which is responsible for executive functions "
                        "including planning and self-control, consumes glucose at a higher rate than other brain regions. "
                        "Some researchers have proposed that providing a glucose boost, such as a sugary drink, "
                        "can temporarily restore decision-making capacity. However, this theory has been contested "
                        "by subsequent studies, and the exact mechanism remains a subject of ongoing investigation.\n\n"
                        "Interestingly, decision fatigue does not affect all types of decisions equally. "
                        "Research suggests that decisions involving trade-offs, where one option must be sacrificed "
                        "in favour of another, are particularly draining. This may explain why shopping, "
                        "which requires constant comparison and evaluation of alternatives, is such a mentally "
                        "exhausting activity. Conversely, simple binary choices, such as accepting or rejecting "
                        "a single offer, appear to deplete cognitive resources less rapidly.\n\n"
                        "There are several practical strategies that individuals and organisations can employ "
                        "to mitigate the effects of decision fatigue. The first is simplification. By reducing "
                        "the number of routine decisions we face each day, we can preserve our cognitive resources "
                        "for more important choices. This is the principle behind the well-known habits of certain "
                        "business leaders and public figures who wear the same outfit every day or eat identical "
                        "meals, thereby eliminating trivial decisions from their daily routine.\n\n"
                        "The second strategy is timing. Research consistently shows that we make better decisions "
                        "earlier in the day, or immediately after a break. Scheduling important meetings, "
                        "negotiations, and financial decisions for the morning, when cognitive resources are "
                        "at their peak, can lead to measurably better outcomes.\n\n"
                        "The third strategy is delegation. When possible, distributing decision-making responsibility "
                        "across multiple people can prevent any single individual from becoming cognitively overwhelmed. "
                        "This is one reason why many successful organisations use committee-based approaches "
                        "for significant decisions.\n\n"
                        "Understanding decision fatigue is not merely an academic exercise. In an era of "
                        "information overload, where we are bombarded with choices from the moment we wake up "
                        "until we go to sleep, recognising the limits of our cognitive capacity is essential. "
                        "By structuring our days and environments to minimise unnecessary decisions, "
                        "we can make better choices about the things that truly matter."
                    ),
                    "order": 1,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "How many decisions does the average adult make per day according to the passage?",
                            "options": ["5,000", "15,000", "25,000", "35,000"],
                            "correct": ["35,000"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "matching_headings",
                            "text": "Match each paragraph with the correct heading. Paragraph 2: Baumeister's experiment",
                            "options": [
                                "Real-world applications of decision fatigue",
                                "The cookie and radish experiment",
                                "Neurological mechanisms",
                                "Practical strategies for improvement"
                            ],
                            "correct": ["The cookie and radish experiment"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "The Israeli judges' study found that parole decisions were affected by how recently the judge had eaten.",
                            "correct": ["TRUE"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What happened to parole approval rates by the end of a judicial session?",
                            "options": [
                                "They remained constant",
                                "They increased to seventy percent",
                                "They fell to nearly zero",
                                "They fluctuated randomly"
                            ],
                            "correct": ["They fell to nearly zero"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Providing glucose has been conclusively proven to restore decision-making capacity.",
                            "correct": ["FALSE"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "Which brain region is primarily involved in decision-making according to the passage?",
                            "options": ["Hippocampus", "Prefrontal cortex", "Cerebellum", "Amygdala"],
                            "correct": ["Prefrontal cortex"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "What is the first strategy mentioned for mitigating decision fatigue?",
                            "correct": ["simplification"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Wearing the same outfit every day is given as an example of simplification.",
                            "correct": ["TRUE"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "According to the passage, when are we most likely to make good decisions?",
                            "options": [
                                "Late in the evening",
                                "During the afternoon",
                                "Earlier in the day or after a break",
                                "After consuming caffeine"
                            ],
                            "correct": ["Earlier in the day or after a break"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "The passage states that we are bombarded with choices from the moment we wake up until we go to ______.",
                            "correct": ["sleep"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Passage 2: Vertical Farming",
                    "text": (
                        "By the year 2050, the global population is projected to reach approximately 9.7 billion people. "
                        "Feeding this many mouths will require an estimated seventy percent increase in food production "
                        "compared to current levels, according to the Food and Agriculture Organization of the United Nations. "
                        "Traditional agriculture, already under severe strain from climate change, soil degradation, "
                        "and water scarcity, may not be able to meet this demand. It is within this context that "
                        "vertical farming has emerged as one of the most promising technological solutions to "
                        "the global food security challenge.\n\n"
                        "Vertical farming is the practice of growing crops in vertically stacked layers, typically "
                        "within an enclosed indoor environment. The concept is not entirely new. The pioneering "
                        "American botanist Dr Dickson Despommier first proposed the idea in 1999 while teaching "
                        "at Columbia University. At the time, the idea was considered somewhat fanciful, "
                        "but advances in controlled environment agriculture, LED lighting technology, "
                        "and hydroponic and aeroponic systems have since made it a commercial reality.\n\n"
                        "In a vertical farm, plants are grown without soil using one of several soilless cultivation "
                        "methods. Hydroponics involves growing plants in a nutrient-rich water solution. "
                        "Aeroponics takes this a step further by suspending plant roots in the air and misting them "
                        "with a nutrient solution. Both methods use significantly less water than conventional agriculture. "
                        "Hydroponic systems, for example, use up to ninety percent less water than field-based farming, "
                        "because the water is recirculated within the system rather than being lost to evaporation "
                        "and runoff.\n\n"
                        "The controlled indoor environment of a vertical farm offers numerous advantages. "
                        "Because the temperature, humidity, light spectrum, and nutrient delivery are all precisely "
                        "managed, crops can be grown year-round regardless of external weather conditions. "
                        "Growing cycles are typically faster than outdoor farming, with some crops such as lettuce "
                        "reaching harvest maturity in as little as twelve days compared to sixty days in the field. "
                        "The enclosed environment also virtually eliminates the need for pesticides and herbicides, "
                        "resulting in cleaner produce with a longer shelf life.\n\n"
                        "Furthermore, vertical farms can be located in urban centres, dramatically reducing the distance "
                        "that food travels from farm to consumer. This concept, known as reducing food miles, "
                        "has significant environmental implications. The average item of food in the United States "
                        "travels approximately 2,400 kilometres from the farm where it was grown to the plate "
                        "where it is consumed. Vertical farms situated within cities could reduce this distance "
                        "to a matter of kilometres, cutting transportation emissions and ensuring fresher produce "
                        "reaches consumers.\n\n"
                        "Despite these considerable benefits, vertical farming faces several significant challenges. "
                        "The most prominent is energy consumption. Growing crops indoors requires artificial lighting, "
                        "and while LED technology has become far more efficient in recent years, the energy demands "
                        "of a large-scale vertical farm remain substantial. Critics argue that unless the electricity "
                        "used is generated from renewable sources, the carbon footprint of vertical farming "
                        "could exceed that of conventional agriculture.\n\n"
                        "The range of crops that can be viably grown in vertical farms is also limited. "
                        "Leafy greens, herbs, and certain berries thrive in these conditions, but staple crops "
                        "such as wheat, rice, and potatoes, which form the caloric backbone of most diets, "
                        "are not currently economically viable to produce vertically. This is largely because "
                        "these crops require large growing areas and have lower value-per-square-metre ratios "
                        "than specialty produce.\n\n"
                        "The capital costs of establishing a vertical farm are also prohibitively high. "
                        "A medium-scale facility can cost anywhere from two million to ten million dollars "
                        "to build and equip, depending on the technology employed. This makes it difficult "
                        "for vertical farming to compete with conventional agriculture on price, "
                        "particularly in developing countries where labour costs are low and land is abundant.\n\n"
                        "Nevertheless, the industry is growing rapidly. Companies such as AeroFarms in the United States, "
                        "Plenty in California, Infarm in Germany, and Gotham Greens in New York have attracted "
                        "hundreds of millions of dollars in investment. Advances in robotics, artificial intelligence, "
                        "and renewable energy are expected to address many of the current limitations within "
                        "the next decade. Singapore, a city-state that imports over ninety percent of its food, "
                        "has emerged as a particularly enthusiastic adopter, with the government setting a target "
                        "of producing thirty percent of its nutritional needs domestically by 2030, much of it "
                        "through vertical farming. As the world grapples with the intersecting challenges of population growth, "
                        "urbanisation, and climate change, vertical farming represents a vital piece of the puzzle "
                        "in building a more sustainable and food-secure future."
                    ),
                    "order": 2,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "By what year is the global population projected to reach 9.7 billion?",
                            "options": ["2030", "2040", "2050", "2060"],
                            "correct": ["2050"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "The concept of vertical farming was first proposed in the 1980s.",
                            "correct": ["FALSE"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "Who first proposed the idea of vertical farming?",
                            "options": [
                                "Carlos Moreno",
                                "Anne Hidalgo",
                                "Dickson Despommier",
                                "Roy Baumeister"
                            ],
                            "correct": ["Dickson Despommier"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "How much less water do hydroponic systems use compared to field-based farming?",
                            "correct": ["up to 90 percent", "up to ninety percent", "90%"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Lettuce in a vertical farm can reach harvest maturity in about twelve days.",
                            "correct": ["TRUE"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What is the average distance food travels from farm to consumer in the United States?",
                            "options": ["400 kilometres", "1,200 kilometres", "2,400 kilometres", "5,000 kilometres"],
                            "correct": ["2,400 kilometres"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "matching_headings",
                            "text": "Match each challenge of vertical farming with its correct description. Challenge: Energy consumption",
                            "options": [
                                "Artificial lighting demands substantial electricity",
                                "Staple crops are not economically viable",
                                "Building costs range from 2 to 10 million dollars",
                                "Only leafy greens can be grown"
                            ],
                            "correct": ["Artificial lighting demands substantial electricity"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "Which of the following is NOT mentioned as a crop suited to vertical farming?",
                            "options": ["Leafy greens", "Herbs", "Wheat", "Berries"],
                            "correct": ["Wheat"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "A medium-scale vertical farm can cost between $2 million and $______ million to build.",
                            "correct": ["10", "ten"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Vertical farming completely eliminates the need for pesticides.",
                            "correct": ["TRUE"],
                            "order": 10,
                            "marks": 1
                        }
                    ]
                },
                {
                    "title": "Passage 3: Whale Communication",
                    "text": (
                        "For decades, scientists have been fascinated by the complexity and sophistication of whale "
                        "communication. Among the most studied species are humpback whales, whose elaborate songs "
                        "have captivated both researchers and the general public since they were first recorded "
                        "during the 1960s by biologist Roger Payne. These songs can travel thousands of kilometres "
                        "through the ocean, and their remarkable structure has prompted researchers to draw parallels "
                        "with human language and music. But what do we actually know about how whales communicate, "
                        "and why is this field of study so important?\n\n"
                        "Whale communication encompasses several distinct types of vocalisation. The most well-known "
                        "are the songs of humpback whales, which consist of complex sequences of moans, cries, "
                        "pulses, and frequency-modulated tones. Each song can last between ten and twenty minutes "
                        "and is repeated continuously for hours. Males are primarily the singers, and the purpose "
                        "of these songs is believed to be related to mating, although some researchers have suggested "
                        "they may also serve territorial or social bonding functions.\n\n"
                        "One of the most remarkable features of humpback whale songs is their cultural transmission. "
                        "All males within a given population sing essentially the same song at any point in time. "
                        "However, this song gradually evolves over the course of several years, with small "
                        "modifications being introduced and spreading through the population. On rare occasions, "
                        "an entirely new song has been observed to spread rapidly across an ocean basin. "
                        "In 2000, researchers documented a new song originating in the east Australian humpback "
                        "population that completely replaced the previous song within just two years. "
                        "This phenomenon, which some scientists have compared to a viral trend in human culture, "
                        "demonstrates a level of social learning and cultural change that was previously thought "
                        "to be unique to humans and certain primates.\n\n"
                        "Sperm whales, a different species entirely, use a very different communication system. "
                        "Rather than melodic songs, sperm whales produce patterns of broadband clicks, "
                        "known as codas. These codas vary in rhythm, tempo, and number, and different social "
                        "groups within the same population use distinct coda repertoires, functioning almost "
                        "like dialects. Research led by Dr Hal Whitehead of Dalhousie University in Canada "
                        "has shown that these dialects are passed from mother to offspring, further supporting "
                        "the idea that whale communication involves cultural learning.\n\n"
                        "Perhaps the most intriguing recent development in whale communication research "
                        "has been the application of artificial intelligence and machine learning techniques. "
                        "In 2024, a team of researchers from the University of California, Berkeley, "
                        "published a study in which they used a deep learning model trained on thousands of hours "
                        "of humpback whale recordings. The model was able to identify distinct call types "
                        "with over ninety percent accuracy, far surpassing the performance of human analysts. "
                        "More provocatively, the researchers claimed that the model detected patterns in the "
                        "whale vocalisations that suggested a degree of syntactic structure, meaning that "
                        "the order in which different calls were produced appeared to carry meaning.\n\n"
                        "This finding has generated considerable debate within the scientific community. "
                        "If confirmed, it would suggest that whale communication is not merely a collection "
                        "of instinctive signals, but something closer to a structured language system. "
                        "However, many linguists and animal behaviourists have urged caution, noting that "
                        "the presence of statistical patterns does not necessarily imply linguistic meaning. "
                        "As Dr Denise Herzing, who has spent over thirty years studying Atlantic spotted dolphins, "
                        "has pointed out, the challenge is not just decoding the signals but understanding "
                        "the context in which they occur.\n\n"
                        "The study of whale communication has practical implications beyond academic curiosity. "
                        "As ocean noise pollution from shipping, military sonar, and offshore construction "
                        "continues to increase, understanding how whales communicate is essential for developing "
                        "effective conservation strategies. Whales rely on sound to find mates, locate prey, "
                        "navigate, and maintain social bonds. Anthropogenic noise can mask these vital signals, "
                        "leading to increased stress, disrupted feeding, and even strandings.\n\n"
                        "Several conservation organisations are now using insights from communication research "
                        "to advocate for quieter shipping lanes, seasonal restrictions on sonar exercises, "
                        "and the establishment of acoustic refuges, areas of the ocean where noise levels "
                        "are maintained below certain thresholds. In this sense, understanding whale "
                        "communication is not just about unlocking the secrets of another species; "
                        "it is about preserving the acoustic environment upon which their survival depends."
                    ),
                    "order": 3,
                    "questions": [
                        {
                            "type": "mcq",
                            "text": "Who first recorded humpback whale songs?",
                            "options": [
                                "Hal Whitehead",
                                "Denise Herzing",
                                "Roger Payne",
                                "Carlos Moreno"
                            ],
                            "correct": ["Roger Payne"],
                            "order": 1,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Humpback whale songs can travel thousands of kilometres through the ocean.",
                            "correct": ["TRUE"],
                            "order": 2,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "According to the passage, which humpback whales primarily sing?",
                            "options": ["Females", "Males", "Both males and females", "Juveniles"],
                            "correct": ["Males"],
                            "order": 3,
                            "marks": 1
                        },
                        {
                            "type": "short_answer",
                            "text": "How long did it take for a new humpback song to completely replace the old one in the year 2000?",
                            "correct": ["two years", "2 years"],
                            "order": 4,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What type of vocalisations do sperm whales produce?",
                            "options": ["Melodic songs", "Patterns of broadband clicks", "Low-frequency moans", "High-pitched whistles"],
                            "correct": ["Patterns of broadband clicks"],
                            "order": 5,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "Sperm whale dialects are learned independently by each individual.",
                            "correct": ["FALSE"],
                            "order": 6,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What accuracy did the deep learning model achieve in identifying humpback whale call types?",
                            "options": ["Over seventy percent", "Over eighty percent", "Over ninety percent", "Over ninety-five percent"],
                            "correct": ["Over ninety percent"],
                            "order": 7,
                            "marks": 1
                        },
                        {
                            "type": "true_false_ng",
                            "text": "All scientists agree that whale communication has syntactic structure.",
                            "correct": ["FALSE"],
                            "order": 8,
                            "marks": 1
                        },
                        {
                            "type": "mcq",
                            "text": "What is one practical application of whale communication research mentioned in the passage?",
                            "options": [
                                "Developing underwater music",
                                "Creating quieter shipping lanes",
                                "Training whales to communicate with humans",
                                "Building underwater communication networks"
                            ],
                            "correct": ["Creating quieter shipping lanes"],
                            "order": 9,
                            "marks": 1
                        },
                        {
                            "type": "fill_blank",
                            "text": "Whales rely on sound to find mates, locate prey, ______, and maintain social bonds.",
                            "correct": ["navigate"],
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
                    "text": "Task 1: The bar chart below shows the percentage of people who owned their own home in five different countries in the years 1970, 1990, and 2010. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
                    "prompt_text": "Task 1",
                    "correct": [],
                    "order": 1,
                    "marks": 0,
                    "time_limit_minutes": 20
                },
                {
                    "type": "writing_task",
                    "text": "Task 2: Some people believe that attending university is the best way to secure a good job, while others believe that there are alternative routes such as apprenticeships and vocational training. Discuss both views and give your own opinion. Write at least 250 words.",
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
                    "text": "Part 1: Introduction. The examiner will ask you general questions about yourself, your home, your studies or work, and your interests.",
                    "prompt_text": "Introduction",
                    "correct": [],
                    "order": 1,
                    "marks": 0
                },
                {
                    "type": "speaking_task",
                    "text": "Part 2: Cue Card. Describe a place you have visited that you found particularly memorable. You should say: where it was, when you went there, what you did there, and explain why it was so memorable to you.",
                    "prompt_text": "Cue Card",
                    "cue_card": {
                        "topic": "Describe a place you have visited that you found particularly memorable",
                        "points": [
                            "where it was",
                            "when you went there",
                            "what you did there",
                            "explain why it was so memorable to you"
                        ]
                    },
                    "correct": [],
                    "order": 2,
                    "marks": 0,
                    "time_limit_minutes": 2
                },
                {
                    "type": "speaking_task",
                    "text": "Part 3: Discussion. The examiner will ask you more abstract questions related to the topic of travel and tourism. Questions may include: How has tourism changed in your country over the past twenty years? Do you think mass tourism does more harm than good? What responsibilities do tourists have when visiting foreign countries?",
                    "prompt_text": "Discussion",
                    "correct": [],
                    "order": 3,
                    "marks": 0
                }
            ]
        }
    ]
}
