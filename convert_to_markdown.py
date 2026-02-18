#!/usr/bin/env python3
"""
Script to convert AWS SAA-03 Solution.txt to markdown format
"""

import re

def convert_to_markdown(input_file, output_file):
    """Convert the text file to markdown format"""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by question numbers (pattern: number followed by ])
    questions = re.split(r'\n(\d+)\]\s*', content)
    
    markdown_content = "# AWS SAA-C03 Solutions\n\n"
    markdown_content += "This document contains solutions and explanations for AWS Solutions Architect Associate (SAA-C03) exam questions.\n\n"
    markdown_content += "---\n\n"
    
    # Process questions (skip first empty element)
    for i in range(1, len(questions), 2):
        if i + 1 < len(questions):
            question_num = questions[i].strip()
            question_content = questions[i + 1].strip()
            
            if not question_content:
                continue
            
            # Split into parts: question, answer, explanation
            parts = question_content.split('\n\n')
            
            markdown_content += f"## Question {question_num}\n\n"
            
            # Process the content
            lines = question_content.split('\n')
            in_answer = False
            in_explanation = False
            
            for line in lines:
                line = line.strip()
                
                if not line:
                    markdown_content += "\n"
                    continue
                
                # Detect answer line
                if line.lower().startswith('ans-') or line.lower().startswith('answer'):
                    in_answer = True
                    answer_text = re.sub(r'^(ans-|answer:?)\s*', '', line, flags=re.IGNORECASE)
                    markdown_content += f"\n**Answer:** {answer_text}\n\n"
                    continue
                
                # Detect keywords/conditions sections
                if any(keyword in line.lower() for keyword in ['keywords:', 'general line:', 'conditions:', 'task:', 'requirements:']):
                    if not in_explanation:
                        markdown_content += "**Key Points:**\n"
                        in_explanation = True
                    markdown_content += f"- {line}\n"
                    continue
                
                # Detect explanation markers
                if any(marker in line.lower() for marker in ['explanation:', 'because:', 'option', 'this option']):
                    if not in_explanation:
                        markdown_content += "\n**Explanation:**\n"
                        in_explanation = True
                
                # Detect separator lines
                if re.match(r'^-{3,}$', line):
                    markdown_content += "\n---\n\n"
                    in_answer = False
                    in_explanation = False
                    continue
                
                # Regular content
                if in_explanation:
                    markdown_content += f"{line}\n"
                else:
                    markdown_content += f"**Scenario:** {line}\n"
                    in_explanation = True
    
    # Write to output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown_content)
    
    print(f"✅ Conversion complete! Output saved to: {output_file}")
    print(f"📊 Total questions processed: {(len(questions) - 1) // 2}")

if __name__ == "__main__":
    input_file = "/Users/buidokhoinguyen/Desktop/aws/AWS SAA-03 Solution.txt"
    output_file = "/Users/buidokhoinguyen/Desktop/aws/AWS SAA-03 Solution.md"
    
    convert_to_markdown(input_file, output_file)
