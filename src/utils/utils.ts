export const throwError = (condition: boolean, message: string) :void => {
    if (condition) throw new Error(message)
}

// export const JWT_SECRET: string = process.env.JWT_SECRET;
export const JWT_SECRET: string = "SUPERSECRETO";
