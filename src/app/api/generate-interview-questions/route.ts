import { NextResponse } from "next/server";
import {
  SYSTEM_PROMPT,
  generateQuestionsPrompt,
} from "@/lib/prompts/generate-questions";
import { logger } from "@/lib/logger";

export const maxDuration = 60;

export async function POST(req: Request, res: Response) {
  logger.info("generate-interview-questions request received");
  
  try {
    const body = await req.json();
    
    // Log the received body for debugging with proper JSON.stringify
    logger.info("Received request body:", JSON.stringify({
      name: body.name,
      objective: body.objective,
      number: body.number,
      contextLength: body.context?.length || 0,
      hasContext: !!body.context
    }, null, 2));
    
    // Validate required fields with better checks
    const missingFields = [];
    
    if (!body.name || body.name.trim() === '') {
      missingFields.push('name');
    }
    
    if (!body.objective || body.objective.trim() === '') {
      missingFields.push('objective');
    }
    
    if (!body.number || isNaN(body.number) || body.number <= 0) {
      missingFields.push('number');
    }
    
    if (!body.context || body.context.trim() === '') {
      missingFields.push('context');
    }
    
    if (missingFields.length > 0) {
      logger.error("Missing required fields in request body:", JSON.stringify({ missingFields }, null, 2));
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          receivedData: {
            name: body.name || 'undefined',
            objective: body.objective || 'undefined',
            number: body.number || 'undefined',
            contextLength: body.context?.length || 0
          }
        },
        { status: 400 }
      );
    }

    // Check if Perplexity API key is available
    if (!process.env.PERPLEXITY_API_KEY) {
      logger.error("Perplexity API key is not configured");
      return NextResponse.json(
        { error: "Perplexity API key is not configured" },
        { status: 500 }
      );
    }

    logger.info("Calling Perplexity API with parameters:", JSON.stringify({
      name: body.name,
      objective: body.objective,
      number: body.number,
      contextLength: body.context?.length || 0
    }, null, 2));

    // Use fetch to call Perplexity API directly - REMOVED response_format
    const apiRequestBody = {
      model: "sonar-pro",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: generateQuestionsPrompt(body),
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    };

    logger.info("Sending request to Perplexity:", JSON.stringify(apiRequestBody, null, 2));

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      logger.error("Perplexity API error:", JSON.stringify({ 
        status: response.status, 
        statusText: response.statusText,
        error: errorData 
      }, null, 2));
      
      return NextResponse.json(
        { 
          error: `Perplexity API error: ${response.status} - ${response.statusText}`,
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      logger.error("No content received from Perplexity:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: "No response generated from AI" },
        { status: 500 }
      );
    }

    // Try to extract JSON from the response (Perplexity might wrap it in markdown)
    let jsonContent = content;
    
    // If the response is wrapped in markdown code blocks, extract it
    if (content.includes('```json')) {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }
    } else if (content.includes('```')) {
      const jsonMatch = content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1];
      }
    }

    // Validate JSON response
    try {
      const parsedContent = JSON.parse(jsonContent);
      if (!parsedContent.questions || !parsedContent.description) {
        logger.error("Invalid response format from Perplexity:", JSON.stringify({ parsedContent }, null, 2));
        return NextResponse.json(
          { error: "Invalid response format from AI" },
          { status: 500 }
        );
      }
    } catch (parseError) {
      logger.error("Failed to parse JSON response from Perplexity:", JSON.stringify({ parseError, content, jsonContent }, null, 2));
      return NextResponse.json(
        { error: "Invalid JSON response from AI" },
        { status: 500 }
      );
    }

    logger.info("Interview questions generated successfully");

    return NextResponse.json(
      {
        response: jsonContent,
      },
      { status: 200 },
    );
  } catch (error: any) {
    logger.error("Error generating interview questions:", JSON.stringify(error, null, 2));
    
    // Provide more specific error messages
    let errorMessage = "Internal server error";
    let statusCode = 500;

    if (error?.status === 429) {
      errorMessage = "Rate limit exceeded";
      statusCode = 429;
    } else if (error?.status === 401) {
      errorMessage = "Invalid Perplexity API key";
      statusCode = 401;
    } else if (error?.status === 400) {
      errorMessage = "Invalid request to Perplexity API";
      statusCode = 400;
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode },
    );
  }
}
