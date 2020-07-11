import { Router } from "express";
import indexController from "./../controller/indexController"
class routerIndex {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config():void {
        this.router.get("/" ,indexController.cargarIndex);
      }
}
export default new routerIndex().router