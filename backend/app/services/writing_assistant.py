import re
from typing import Optional


DIFFICULT_WORDS = {
    "summarize": "Write only the important information.",
    "summarise": "Write only the important information.",
    "relevant": "Important and related to the topic.",
    "comparison": "Explain how things are similar or different.",
    "compare": "Explain how things are similar or different.",
    "overview": "A short summary of the whole chart or diagram.",
    "trend": "A general increase, decrease, or pattern over time.",
    "process": "Steps that happen in order, one after another.",
    "feature": "An important or noticeable part of the information.",
    "significant": "Important or noticeable.",
    "illustrate": "Show or describe clearly.",
    "depict": "Show or represent.",
    "data": "Facts and numbers collected for analysis.",
    "percentage": "A number out of 100.",
    "proportion": "A part or share of the whole.",
    "fluctuate": "Go up and down irregularly.",
    "steady": "Stable, not changing much.",
    "sharp": "Big and sudden change.",
    "gradual": "Slow and steady change.",
    "peak": "The highest point.",
    "decline": "A decrease or drop.",
    "remain unchanged": "Stay the same.",
    "respectively": "In the order listed.",
    "approximately": "About or roughly.",
    "whereas": "While or but (comparing two things).",
    "consequently": "As a result or because of this.",
    "furthermore": "In addition or also.",
    "nevertheless": "Even so or however.",
    "compulsory": "Required, you must do it.",
    "to what extent": "How much do you agree or disagree.",
    "discuss both views": "Talk about two different opinions.",
    "give your opinion": "Say what you think.",
    "advantages": "Good things or benefits.",
    "disadvantages": "Bad things or drawbacks.",
    "problem": "Something wrong or difficult.",
    "solution": "A way to fix or solve something.",
    "formal": "Official and polite language.",
    "semi-formal": "Between formal and informal.",
    "informal": "Casual, friendly language.",
    "tone": "The attitude or feeling of your writing.",
    "coherence": "How well ideas connect and flow.",
    "vocabulary": "The words you use in your writing.",
    "task achievement": "How well you answered the question.",
}

ACADEMIC_TASK1_SIMPLIFIED = {
    "graphs": "This chart shows information as numbers or bars. Write about the most important points. Compare the data when you can. Do not give your opinion. Write at least 150 words.",
    "tables": "This table shows information organized in rows and columns. Write about the key numbers and patterns. Compare the data between categories. Do not give your opinion. Write at least 150 words.",
    "maps": "These maps show how a place has changed over time. Describe the main differences between the maps. Write about what was added, removed, or changed. Write at least 150 words.",
    "process": "This diagram shows steps in a process. Describe each step in order. Use sequence words like first, then, next, finally. Write at least 150 words.",
    "mixed_charts": "These charts show different types of information together. Describe the main trend in each chart. Write about the most important points. Write at least 150 words.",
}

GENERAL_TASK1_SIMPLIFIED = {
    "formal_letter": "Write a formal letter to an official or stranger. Use polite and professional language. Address all the points in the question. Write at least 150 words.",
    "semi_formal_letter": "Write a letter to someone you know but in a professional way. Be polite but slightly friendly. Address all the points in the question. Write at least 150 words.",
    "informal_letter": "Write a friendly letter to someone you know well. Use casual language. Address all the points in the question. Write at least 150 words.",
}

TASK2_SIMPLIFIED = {
    "opinion": "This essay asks for your opinion. Choose one side and explain why you think this way. Give examples to support your ideas. Write at least 250 words.",
    "discussion": "This essay asks you to discuss different opinions. Explain both sides, then give your own view. Write at least 250 words.",
    "problem_solution": "This essay asks you to identify problems and suggest solutions. Explain the problems clearly, then offer realistic fixes. Write at least 250 words.",
    "advantages": "This essay asks about good and bad points. Discuss the benefits and drawbacks. Give your opinion about which is stronger. Write at least 250 words.",
    "double_question": "This essay asks two different questions. Answer both questions fully. Give reasons and examples. Write at least 250 words.",
    "essay": "This essay asks for your opinion on a topic. Explain your ideas clearly with examples. Use paragraphs to organize your answer. Write at least 250 words.",
}

ACADEMIC_TASK1_EXPECTATIONS = [
    "Describe the information shown in the chart or diagram.",
    "Write a clear overview summarizing the main trends or features.",
    "Compare important features and data points.",
    "Do not give your personal opinion.",
    "Use formal and academic language.",
    "Write at least 150 words.",
]

GENERAL_TASK1_EXPECTATIONS = [
    "Write in the correct letter style (formal, semi-formal, or informal).",
    "Address all bullet points in the question.",
    "Use a suitable tone for the situation.",
    "Include specific details and reasons.",
    "Write at least 150 words.",
]

ACADEMIC_TASK2_EXPECTATIONS = [
    "Answer the question fully and directly.",
    "Support your ideas with reasons and examples.",
    "Use clear paragraph structure.",
    "Give specific examples to support points.",
    "Write at least 250 words.",
]

GENERAL_TASK2_EXPECTATIONS = [
    "Present your opinion clearly.",
    "Organize your ideas logically.",
    "Use linking words to connect ideas.",
    "Support your points with examples.",
    "Write at least 250 words.",
]

ACADEMIC_TASK1_MISTAKES = [
    "Copying the question word for word.",
    "Describing every single number or data point.",
    "Missing the overview paragraph.",
    "Giving your personal opinion or feelings.",
    "Writing too few words (below 150).",
]

GENERAL_TASK1_MISTAKES = [
    "Using the wrong letter style (formal vs informal).",
    "Forgetting to address all bullet points.",
    "Using an inappropriate tone.",
    "Being too brief or missing details.",
    "Writing too few words (below 150).",
]

TASK2_MISTAKES = [
    "Going off-topic or not answering the question.",
    "Using weak or no examples.",
    "Repeating the same vocabulary.",
    "Writing a very short essay (below 250 words).",
    "Not using paragraphs or clear structure.",
]

GENERAL_TIPS = [
    "Plan your essay for 3-5 minutes before writing.",
    "Leave 3-5 minutes at the end to check grammar and spelling.",
    "Write clear topic sentences for each paragraph.",
    "Do not memorize or copy pre-written essays.",
    "Use linking words naturally (however, furthermore, in addition).",
    "Stay on topic and answer the question directly.",
]

TASK1_WORD_GOALS = {"minimum_words": 150, "recommended_time": 20}
TASK2_WORD_GOALS = {"minimum_words": 250, "recommended_time": 40}


def simplify_question(prompt_text: str, module: str, task_type: str, subtype: str) -> str:
    if task_type == "Task 2":
        return TASK2_SIMPLIFIED.get(subtype, TASK2_SIMPLIFIED.get("essay", ""))
    if module == "general":
        return GENERAL_TASK1_SIMPLIFIED.get(subtype, "Write a clear letter addressing all points. Write at least 150 words.")
    return ACADEMIC_TASK1_SIMPLIFIED.get(subtype, "Describe the information clearly. Write an overview. Write at least 150 words.")


def detect_difficult_words(prompt_text: str) -> list[dict]:
    words_found = []
    text_lower = prompt_text.lower()
    seen = set()
    for word, meaning in DIFFICULT_WORDS.items():
        if word in text_lower and word not in seen:
            words_found.append({"word": word, "meaning": meaning})
            seen.add(word)
    return words_found


def get_examiner_expectations(module: str, task_type: str, subtype: str = None) -> list[str]:
    if task_type == "Task 2":
        if module == "general":
            return GENERAL_TASK2_EXPECTATIONS
        return ACADEMIC_TASK2_EXPECTATIONS
    if module == "general":
        return GENERAL_TASK1_EXPECTATIONS
    return ACADEMIC_TASK1_EXPECTATIONS


def get_common_mistakes(module: str, task_type: str) -> list[str]:
    if task_type == "Task 2":
        return TASK2_MISTAKES
    if module == "general":
        return GENERAL_TASK1_MISTAKES
    return ACADEMIC_TASK1_MISTAKES


def get_tips() -> list[str]:
    return GENERAL_TIPS


def get_word_goals(task_type: str) -> dict:
    if task_type == "Task 2":
        return TASK2_WORD_GOALS
    return TASK1_WORD_GOALS


def get_assistant_data(module: str, task_type: str, subtype: str, prompt_text: str) -> dict:
    return {
        "simplified_question": simplify_question(prompt_text, module, task_type, subtype),
        "difficult_words": detect_difficult_words(prompt_text),
        "examiner_expectations": get_examiner_expectations(module, task_type, subtype),
        "common_mistakes": get_common_mistakes(module, task_type),
        "tips": get_tips(),
        "minimum_words": get_word_goals(task_type)["minimum_words"],
        "recommended_time": get_word_goals(task_type)["recommended_time"],
    }
