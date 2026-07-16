import asyncio
import edge_tts
import os

# --- PART 1: THE FULL DATASET ---
ielts_test_data = [
    {
        "id": 1,
        "title": "Wincham Farm Residential Center",
        "level": "Beginner",
        "voice": "en-GB-LibbyNeural", # British Female
        "filename": "beginner_01.mp3",
        "text": """
        Speaker 1: Part one, you will hear a telephone conversation about Wincham farm, a residential education center. First, you have some time to look at questions one to four. You will see that there is an example that has been done for you. On this occasion only the conversation relating to this will be played first. Hello Wincham Farm Center. 
        Speaker 2: Oh, hello. I want to arrange a weekend away from myself and some people from work. And we heard about your center. I wonder if you could give me some details. 
        Speaker 3: Yes, certainly. We are a residential center attached to a working farm. And we organize educational activities for those guests who want them. What else would you like to know? 
        Speaker 1: The caller wishes to arrange a weekend away for himself and some colleagues. So option C has been circled. Now we shall begin. You should answer the questions as you listen. Because you will not hear the recording a second time. Listen carefully and answer questions one to four. Hello, Wincham Farm Center. 
        Speaker 2: Oh, hello. I want to arrange a weekend away from myself and some people from work. And we heard about your center. I wonder if you could give me some details. 
        Speaker 3: Yes, certainly. We are a residential center attached to a working farm. And we organize educational activities for those guests who want them. What else would you like to know? 
        Speaker 2: Well, firstly, what kind of accommodation Have you got? 
        Speaker 3: A we've got eight rooms all together. And we can sleep 38 At any one time. Three of the rooms have got six bunks, and five of them have got four bunks, right? And what other facilities are there. 
        Speaker 3: We have separate toilets and showers for each of the rooms. There's a large dining room, and a large meeting room, which can be booked by groups in advance. But I'm afraid we had a flood in there last month, and the floor was slightly damaged. So unfortunately, it's out of use just now. We got workmen coming in next week. When were you thinking of staying 
        Speaker 2: in three weeks time the 28th of September? 
        Speaker 3: Oh, it should be okay by then. 
        Speaker 2: Oh, well. That's okay then. And what about food? Do you provide meals? Or is it self catering? 
        Speaker 3: We're very flexible. As long as you give us enough notice we can cater for you. Or if you prefer you can just bring your own food and use the kitchen facilities. And some people prefer to eat out which is also fine. 
        Speaker 2: Fine. And I heard that your farm is organic. Does that mean that you only have crops and no animals? 
        Speaker 3: It doesn't actually a lot of people seem to think that. But we do Rio livestock as well. And so we have a wide range of food. Organic means it's all produced without the use of artificial fertilizers or pesticides. 
        Speaker 2: I see that sounds good. Could you tell me what sort of recreational activities are available either at the center or in the area? Yes. 
        Speaker 3: Here at the center. We offer farm tours. They're very popular. One of the farm managers shows people around and explain some of the principles of organic farming and for any visitors who are really keen you let them drive a tractor or feed the animals and so on. With supervision of course. 
        Speaker 2: I think a lot of our group would be interested in that. It make a change from factory work. 
        Speaker 3: Well, if they fancy I tell them to come prepared. Plenty of old clothing is specially footwear, it can be very messy and wet. Okay, I'll warn them. 
        Speaker 1: Before you hear the rest of the conversation, you have some time to look at questions five to ten. Now listen and answer questions five to ten. 
        Speaker 3: And another type of activity we do is survival courses. But that's only for groups of five or more. And they've got to be acquaintances, they have to cooperate closely. These courses are very popular, especially with school groups, but adults seem to enjoy them too. What do they involve the things like map reading? 
        Speaker 3: Well, not exactly what it is. We've got a large area of woodland on the farm. And we run this course there. It's mainly about collecting food and water, lighting a fire without any equipment, that kind of thing. 
        Speaker 2: This weekend could be hard work. What about the area around the center? What is there to do? 
        Speaker 3: If you look at a map, you'll see that we've very well situated here. Our centers about midway between the x more National Park, which is very popular for hill walking, and the south coast, which has very good beaches. 
        Speaker 2: Are they both within walking distance? 
        Speaker 3: Well, they're both a bit far out unless you're very fit. But they're only about 30 minutes by road. And there's also a cycle path which starts quite near here. About 10 minutes walk away. You can hire bikes at the starting point. 
        Speaker 2: What is there to do if the weather's bad? I hope it won't be but you never know. Yes, 
        Speaker 3: that's right. Well, on most Saturday evenings, we show films here. And then once a month, a group of local musicians performs in our meeting room. And then Sherbourne is only 14 miles away. It's only a small town, but it's got a very good Museum, and an old Abbey, which is well worth a visit. 
        Speaker 2: Well, it sounds perfect for our purposes. One last thing, what about prices? I'm not sure yet, but they'll probably be about 15 of us. 
        Speaker 3: We charge a standard 14 pounds ahead for accommodation, whether there are 10 or 20 of your whatever. And about seven pounds for cooked meals, depending on the menu you want. Use of the kitchen facilities is extra, as is the higher of the meeting room. It depends really what exactly you want and for how many people. 
        Speaker 2: Right? Well, I've made a note of all that, and I'll discuss it with the rest of the group. Then I'll get back to you with a firm booking. Can I do that by phone? 
        Speaker 3: Yes, you can. But once you've made a booking, we would need a deposit within five days to secure it. Then you just pay the balance when you're here. 
        Speaker 2: No. Yes, of course. Could you give me the address please? 
        Speaker 3: Yes, it's Wincham farm Cateel road that's C O T e h e l e near Sherborn and the postcode is S H 12. One L Q. Thank you. 
        Speaker 1: That is the end of this part. You now have half a minute to check your answers.
        """
    },
    {
        "id": 2,
        "title": "Student Vacation Jobs Survey",
        "level": "Intermediate",
        "voice": "en-AU-WilliamNeural", 
        "filename": "intermediate_01.mp3",
        "text": """
        Speaker 1: Part two, you will hear a program on a student radio station. It describes the findings of a survey on vacation jobs taken by students the previous year. First, you have some time to look at questions. Now listen carefully and answer questions. 
        Speaker 2: Welcome to Student Life, it's spring, and many of you may be thinking about arranging work for the long vacation. So on today's program, Roger endwell reports on a survey we conducted into the pleasures and problems of vacation jobs. Raja. 
        Speaker 3: Thank you, Sara. Well, the first thing to say is that by far the majority of students we surveyed did just three types of jobs. All of these obviously had their advantages and disadvantages. Starting with stocktaking in supermarkets. 
        The thing that students said they enjoyed most about this job was the traveling, they are often required to go to branches to do their stock takes. And this was regarded as an interesting plus. The main negative, however, was that they tended to find the job tiring with long hours spent on their feet and climbing high shelves. 
        Now, one thing we did ask the students in our survey was whether they had any recommendations for other people taking on their job. And they said perhaps not surprisingly, get good shoes. That's the only way you can keep going. Another job which lots of students did was office work. And the positive feature of this actually rather surprised me. 
        Until I remembered what a hot summer it was last year. Lots of students named air conditioning as the best thing about office work. The downside, which many talked about, was wearing formal clothes. Obviously, this didn't go down too well with students. The advice most people gave was to select a large office. 
        That way you have more variety of social contact. Otherwise, the work can get very boring. The third job which had attracted large numbers of students, was as a theme park attendant. And again, I got a surprise here, because the big plus people talked about was good pay. I must have improved since my day, I must say. 
        Anyway, the downside I did recognize having to deal with difficult customers, especially in the heat when tempers get frayed, not easy. And people said that it was a good idea to live nearby. Because there's a lot of shift work and you don't have to worry about transport at difficult times of the day. 
        Speaker 1: Before you hear the rest of the program, you have some time to look at questions. Now listen, and answer questions. 
        Speaker 3: So those were the findings from the survey on the most common student jobs. But not all student jobs have to be mundane and boring. One of the students who responded in our survey, spoke at length about his amazing job as a zoo attendant. Peter Marshall had read about work opportunities on the zoo website, and just went along with a friend to talk to someone in personnel. 
        He was offered a job there. And then as easy as that. In previous years, he'd done singularly unexciting shop work. So he was very pleased to be doing such original work. He ended up working for just under three months, which was actually slightly more than he had anticipated, and meant that he had to miss part of university term time. 
        But he said it was well worth it because he thinks he's found his future career path as a result of this experience. He loved working on the educational side, in particular helping young kids understand about the animals in their natural environment.
        He said it was the most intriguing thing he'd ever done. He tells us though, that with final exams coming up, he won't be able to do any paid work this coming vacation. So why don't you apply if you're interested in getting further information about the findings of the survey. 
        Speaker 1: That is the end of this part. You now have half a minute to check your answers.
        """
    },
    {
        "id": 3,
        "title": "Geology Study Syndicate",
        "level": "Intermediate",
        "voice": "en-GB-RyanNeural", 
        "filename": "intermediate_02.mp3",
        "text": """
        Speaker 1: you will hear three geology students, Andy, Bob and Helen, talking about forming a study syndicate for their forthcoming examinations. First, you have some time to look at questions. Now, listen carefully and answer questions.
        Speaker 2: Right then, are we ready, Bob Helen here? And is someone taking notes for John? He's at a tutorial, isn't he? Yeah, I'll let him know what we agree. 
        Speaker 2: Good. Okay. Well, first thing is, has anyone apart from me actually been in a study syndicate before? No. What does it actually involve? Andy? 
        Speaker 2: Well, the idea is that it's a way for us, for students to study together without a teacher. Oh, yeah. Right. When I did it last time, I found it helpful because, well, as I said, there's no teacher. So it means we're teaching one another. And I found I really learned a lot through having to teach it myself. It seemed a very good way to learn. 
        Speaker 3: And presumably, it gives us the chance to share ideas as well. And you get fuller notes if you're all doing the reading. 
        Speaker 2: That's right. And as well as that, because of that, really, you can do, you know, much deeper research. So I thought we could try it to revise what we've done on the geology course. Because I know this is the one that most of us are worried about the geology exam. 
        Speaker 4: So the idea is we all look at a different topic, a different topic from the geology course. And then give a presentation and talk about it. 
        Speaker 2: That's right. I've drawn up the framework of a table which might be useful. Here. I've made a copy. Oh, thanks. For the first topic, I thought we could maybe do mountain building. Is that alright? 
        Speaker 4: Yeah, sure. Actually, would you mind if I did that? I'm quite interested in it. Right, right. 
        Speaker 2: So is May 9, okay, for that? Yeah, I'll just write that down. And it's Bob for mountain building. And the following week, it can't be May 16. Because of our tutorial, but what about the 17th? Okay. 
        Speaker 4: And what about the next topic? What would be the next priority? 
        Speaker 3: Well, there's glaciated areas, but I don't want to do that. Fair enough. Actually, I 
        Speaker 2: don't mind having a bash. I did an assignment on them. glaciated areas, Andy. Then we need someone to do rock formation on? 
        Speaker 3: Yeah. Okay. And John said he'd like to, to so you can put us both down for that. When? May 23 would be best. 
        Speaker 2: rock formation, Helen and John, right? That really only leaves one week before the exams showing make it on the 30th? I can't make it I'm afraid 29th of May. The exams on June 3 have to be okay. Any ideas for a topic? 
        Speaker 4: Or John said he wouldn't mind doing something on volcanoes? Great. Let's everyone then. 
        Speaker 1: Before you hear the rest of the conversation, you have some time to look at questions 26 to 30. Now listen and answer questions 26 to 30. 
        Speaker 4: And how long should these presentations be? Well, 
        Speaker 2: it's obviously up to us. In my experience, 30 minutes is bad enough? 
        Speaker 3: Maybe a bit short, I'd have thought 40 minutes would be more like it. Well, shall we say 30 to 40 minutes. 
        Speaker 4: Okay. And presumably time for questions and discussion? 
        Speaker 2: Yes. Together, they usually take about 20 minutes. 
        Speaker 3: Where should we get the information from? Is it mainly lecture notes? 
        Speaker 2: will actually I suggest we avoid those because we already have all that information. I think it's better to go more deeply. We could use the bibliography and anything else we find in the library, any other books and articles, you know, from the journals. 
        Speaker 4: And then of course, there's lots of stuff on the internet. Yes, that's the sort of thing. And what about the presentations? Will we just be talking? Presumably we can't use slides. It'd be a bit difficult but we can use the OHP and the whiteboard Of course, 
        Speaker 4: And we can make fun copies of our notes so everyone can have a copy. Yes, great. So is there anything else? 
        Speaker 1: That is the end of this test. You now have half a minute to check your answers.
        """
    },
    {
        "id": 4,
        "title": "Health on the Night Shift",
        "level": "Advanced",
        "voice": "en-US-AndrewNeural", # Clear US Academic Male
        "filename": "advanced_01.mp3",
        "text": """
        Good afternoon, everybody. In this session, I want to continue looking at health issues relating to the workplace. And I'd like to focus today on night shift workers and the health problems that are associated with their working hours. 
        I'm sure you're all aware that there has been a huge increase in the number of workers doing regular night shifts in recent years, mainly because of the number of shops and services now open 24 hours, seven days a week. 
        And we need to look more closely at the consequences of changing work and sleep patterns like this. So that's what I'd like us to do today. Now, research that has been carried out in both the US and Britain on night working suggests that it leads to a lot of health problems for the workers. 
        And they point to three main reasons for this. The first one is what they call the internal clock. And this is a basic sort of program in our brains. This tells us that at certain times, we should feel hungry. 
        At other times we should be awake. At other times we should be asleep and so on. And it seems to be generally accepted by all the experts in the field that this clock is linked to not just our behavioral habits, but to cycles of light and dark.
        And that means that we're programmed to be awake when it's light, ie during the day and asleep when it's dark. The second thing is that night workers are continually fighting against what is termed asleep debt.
        And by this, the researchers mean that it's just practically impossible for them to get a sufficient amount of sleep in daylight hours. In fact, studies suggest that on average night workers only get between five and six hours of sleep rather than the aid they need. 
        And the effects of not getting enough sleep can also lead to all sorts of problems. And we'll talk about those in a minute. The third cause of these problems is the unsocial hours that night workers have to keep the fact that they are working when their families their friends are sleeping, and vice versa. 
        And that kind of dislocation from their social group can be very damaging. Okay, so let's take a closer look at some of these effects. And if we have a look at the physical effects first, we can see that studies on long term shift workers found that they were much more likely to get heart problems than day workers.
        In addition, there seems to be a very high incidence of stomach problems for example, ulcers among nightshift workers. And although this may be partly due to the wrong sort of diet, you know, snacking on fast food, it can't be just explained by eating habits. 
        And finally, there is evidence to suggest that nightshift workers also get ill more frequently with minor problems like colds and infections. The frequency of these illnesses is much higher than among day workers. And this indicates that night working can damage immunity to illness. 
        And of course, this leads to a lot of absence from work to. However, although the physical impact of working nights can be severe, perhaps the real problems are psychological ones. And the most common problem is depression. 
        This seems to be the inevitable result of the constant feeling of tiredness and a lack of energy that night workers universally complain of. Secondly, there is a lot of evidence from accident statistics to suggest that mental abilities are badly affected and that means for example, decision making ability and planning ability. 
        And these are what control our performance. For example, we can see that the highest number of errors on the roads occur between 3am and 5am. The point in our internal clock when we feel most sleepy, okay. Finally, there are the social problems where networking impacts on the family and social life of the employees. 
        The first one is obviously the breakup of family life. And here we can see from the divorce statistics that this occurs more frequently in the case of night workers. But there's also the breakdown of other relationships, not just within the family, but among the peer group. Night workers tend to lose touch with friends. 
        And these relationships especially for the long term night workers are very difficult to rebuild. And so this eventually leads to social isolation for the individual. And of course that has consequences for the whole community too. So we can begin to see the real cost of night working. What we need to do now is to look at how... 
        That is the end of this part. You now have half a minute to check your answers.
        """
    }
]

# --- PART 2: THE GENERATOR ---
async def generate_all_audio():
    # Make sure output folder exists (relative to where script is run)
    # Adjust this path based on where you are running the script
    output_folder = os.path.join("..", "static", "audio")
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    print(f"🚀 Starting Audio Factory... Saving to: {output_folder}")

    for test in ielts_test_data:
        print(f"🎙️ Generating Audio: {test['filename']} ({test['level']})")
        communicate = edge_tts.Communicate(test['text'], test['voice'])
        await communicate.save(os.path.join(output_folder, test['filename']))

    print("\n✅ Success! All 4 long files are ready.")

if __name__ == "__main__":
    asyncio.run(generate_all_audio())