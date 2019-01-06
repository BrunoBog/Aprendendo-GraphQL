import * as Sequelize from "sequelize";
import { MOdelsInterface } from "./ModelsInterface";

export interface DbConnection extends MOdelsInterface {
    sequelize: Sequelize.Sequelize;
}