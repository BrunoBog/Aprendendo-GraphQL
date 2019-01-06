import * as Sequelize from "sequelize";
import { BaseModelInterface } from "../interfaces/BaseModelInterface";
import { MOdelsInterface } from "../interfaces/ModelsInterface";

export interface CommentAttributes {
    id?: number;
    comment?: string;
    post?: number;
    user?: number;
    createAt?: string;
    updatedAt?: string;
}

export interface ComentInstance extends Sequelize.Instance<CommentAttributes> { };

export interface CommentModel extends BaseModelInterface, Sequelize.Model<ComentInstance, CommentAttributes> { }

export default (sequelize: Sequelize.Sequelize, Datatypes: Sequelize.DataTypes): CommentModel => {
    const Comment: CommentModel = sequelize.define('Comment', {
        id: {
            type: Datatypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        comment: {
            type: Datatypes.STRING,
            allowNull: false
        }
    },
        {
            tableName: 'comments'
        });

    Comment.associate = (models: MOdelsInterface): void => {
        Comment.belongsTo(models.Post, {
            foreignKey: {
                allowNull: false,
                field: 'post',
                name: 'post'
            }
        });
        {
            Comment.belongsTo(models.User, {
                foreignKey: {
                    allowNull: false,
                    field: 'user',
                    name: 'user'
                }
            });
        }
    }

    return Comment;
}