import { validator } from "../shared/Validator.js";

export class CartEntity {
    constructor(products) {
        this.validateDataTypes(products)
    }
    validateDataTypes(fields) {
        for (const [key, value] of Object.entries(fields)) {
            if (key === "products") {
                validator.validateArray(key, value);
            }
        }
    }
}
