import { MOdelsInterface } from "./ModelsInterface";

export interface BaseModelInterface {
    prototype?;
    associate?(models: MOdelsInterface): void;
}