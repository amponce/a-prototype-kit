import React from 'react';
import { PromptCards } from './PromptCards';

export const EXAMPLE_PROMPTS = [
  {
    text: 'Build a VA landing page with a contact form',
    fullPrompt: `Create a VA landing page with a contact form that includes:
    Full width desktop version 
    Minimal VA header and footer
    Full width hero section with VA primary blue background (#0071bc)
    Six service cards for Health Care, Disability Benefits, Education & Training, Home Loans, Life Insurance, and Career Development
    Testimonial section with 3 veteran success stories
    Statistics section showing VA impact numbers
    Call-to-action section
    Comprehensive contact form with:
    First and last name fields
    Email and phone fields
    Service status dropdown
    Topic selection
    Message textarea
    Preferred contact method radio buttons
    Newsletter subscription checkbox
    Contact information sidebar with phone number, hours, and social links
    Proper VA Design System styling and components
    Mobile-responsive layout
    note: only use web components from the VA Design System, and do not use any images only svg icons`,
  },
  {
    text: 'VA Education Benefits Dashboard',
    fullPrompt: `Create a simple VA education benefits dashboard showing:

1. Benefits summary card with:
   - Benefit type (Post-9/11 GI Bill)
   - Months remaining
   - Current school

2. Two action buttons:
   - Verify Attendance
   - View Payment History

Use VA web components and keep the implementation minimal.`,
  },
  {
    text: 'VA claims tool and with document uploader',
    fullPrompt: `Create a simple VA claims status tracker with document uploader that helps veterans:

1. View a summary of current claims:
   - Claim type and date filed
   - Current status with estimated completion date
   - Required actions (if any)

2. Add a basic document uploader that allows:
   - Drag and drop or file selection
   - File type validation (PDF, JPG, PNG only)
   - Simple progress indicator

Include a "Need Help?" section with VA contact information for claim questions.

Use VA web components and design system for a consistent look and feel.`,
  },
  {
    text: 'VA Health Records Viewer',
    fullPrompt: `Create a simple VA Health Records viewer that shows:

1. Recent medical appointments:
   - Date, time, and facility
   - Provider name and specialty
   - Virtual or in-person indicator

2. Current medications with:
   - Medication name and dosage
   - Refill status and button to request refills
   - Basic information about each medication

Add a "Print Records" button and include the va-need-help component.

Keep the implementation minimal using VA web components and utility classes.`,
  },
];

export function ExamplePrompts(sendMessage?: { (event: React.UIEvent, messageInput?: string): void | undefined }) {
  if (!sendMessage) {
    return null;
  }

  const handleCardClick = (event: React.UIEvent, messageInput?: string) => {
    console.log('ExamplePrompts forwarding message:', messageInput);
    sendMessage(event, messageInput);
  };

  return <PromptCards prompts={EXAMPLE_PROMPTS} sendMessage={handleCardClick} />;
}
