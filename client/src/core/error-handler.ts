import { NextResponse } from "next/server";

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 400,
        public code?: string
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class UnauthorizedError extends AppError {
    constructor(message: string = "Unauthorized access") {
        super(message, 401, "UNAUTHORIZED");
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Resource not found") {
        super(message, 404, "NOT_FOUND");
    }
}

export function handleError(error: unknown) {
    console.error("[API_ERROR]", error);

    if (error instanceof AppError) {
        return NextResponse.json(
            {
                error: {
                    message: error.message,
                    code: error.code || "INTERNAL_ERROR",
                },
            },
            { status: error.statusCode }
        );
    }

    // Fallback for unexpected errors
    return NextResponse.json(
        {
            error: {
                message: "An unexpected error occurred",
                code: "INTERNAL_ERROR",
            },
        },
        { status: 500 }
    );
}
