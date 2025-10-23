import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { env } from "@/lib/env-validation";
import { ApiResponseHandler, InputValidator } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const { email, name, subject, message, phone } = await req.json();
    
    // Validate required fields
    const requiredFields = { email };
    const validationErrors = InputValidator.validateRequired(requiredFields);
    
    if (validationErrors.length > 0) {
      const errorResponse = ApiResponseHandler.validationError('email', validationErrors[0]);
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Validate email format
    if (!InputValidator.validateEmail(email)) {
      const errorResponse = ApiResponseHandler.validationError('email', 'Invalid email format');
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      email: InputValidator.sanitizeString(email),
      name: name ? InputValidator.sanitizeString(name) : undefined,
      subject: subject ? InputValidator.sanitizeString(subject) : undefined,
      message: message ? InputValidator.sanitizeString(message) : undefined,
      phone: phone ? InputValidator.sanitizeString(phone) : undefined,
    };
    // If only email provided, treat as newsletter subscription
    if (sanitizedData.email && !sanitizedData.name && !sanitizedData.subject && !sanitizedData.message) {
      const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);
      await convex.mutation(api.CreateContactMessage.SubscribeNewsletter, { 
        email: sanitizedData.email 
      });
      const successResponse = ApiResponseHandler.success({ type: "subscription" }, "Successfully subscribed to newsletter");
      return NextResponse.json(successResponse);
    }
    
    // Otherwise, treat as full contact message (persist minimal record)
    const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);
    
    // Validate required fields for contact message
    const contactRequiredFields = { name: sanitizedData.name, subject: sanitizedData.subject, message: sanitizedData.message };
    const contactValidationErrors = InputValidator.validateRequired(contactRequiredFields);
    
    if (contactValidationErrors.length > 0) {
      const errorResponse = ApiResponseHandler.validationError('contact_fields', contactValidationErrors[0]);
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    await convex.mutation(api.CreateContactMessage.CreateContactMessage, {
      name: sanitizedData.name!,
      email: sanitizedData.email,
      subject: sanitizedData.subject!,
      message: sanitizedData.message!,
      phone: sanitizedData.phone,
    });
    
    const successResponse = ApiResponseHandler.success({ type: "contact" }, "Message sent successfully");
    return NextResponse.json(successResponse);
  } catch (e) {
    console.error("/api/contact error", e);
    const errorResponse = ApiResponseHandler.internalError("Failed to process contact message");
    return NextResponse.json(errorResponse, { status: 500 });
  }
}


