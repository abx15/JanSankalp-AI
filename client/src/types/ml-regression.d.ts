// Type declaration for ml-regression (no official @types package available)
declare module 'ml-regression' {
    export class SimpleLinearRegression {
        constructor(x: number[], y: number[]);
        predict(x: number): number;
        slope: number;
        intercept: number;
        score(x: number[], y: number[]): { r2: number };
    }

    export class PolynomialRegression {
        constructor(x: number[], y: number[], degree: number);
        predict(x: number): number;
        coefficients: number[];
        score(x: number[], y: number[]): { r2: number };
    }

    export class MultivariateLinearRegression {
        constructor(x: number[][], y: number[][]);
        predict(x: number[]): number[];
    }

    export class ExponentialRegression {
        constructor(x: number[], y: number[]);
        predict(x: number): number;
    }

    export class PowerRegression {
        constructor(x: number[], y: number[]);
        predict(x: number): number;
    }
}
