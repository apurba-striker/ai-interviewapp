import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { logger } from "@/lib/logger";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Interviewer ID is required" },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Delete the interviewer
    const { error } = await supabase
      .from("interviewers")
      .delete()
      .eq("id", id);

    if (error) {
      logger.error("Error deleting interviewer:", error);
      return NextResponse.json(
        { error: "Failed to delete interviewer" },
        { status: 500 }
      );
    }

    logger.info(`Interviewer ${id} deleted successfully`);
    return NextResponse.json(
      { message: "Interviewer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    logger.error("Error in delete-interviewer route:",);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
