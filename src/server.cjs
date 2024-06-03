const express = require("express");
const cors = require("cors"); // Importe o middleware cors
const app = express();
const path = require("path");
const AdminController = require("./Client/services/controllers/AdminController.cjs");
const AuthController = require("./Client/services/controllers/AuthController.cjs");
const authenticateMiddleware = require("./shared/services/middlewares/authenticate.cjs");
const BarberAuthController = require("./Barbershop/services/controllers/BarberAuthController.cjs");
const VerifyEmail = require("./shared/services/controllers/VerifyEmail.cjs");
const ImagesController = require("./shared/services/controllers/ImagesController.cjs");
const DataBarberController = require("./Barbershop/services/controllers/DataBarberController.cjs");
const ConfirmationSchedule = require("./shared/services/controllers/ConfirmationSchedule.cjs")
const scheduleMiddleware = require("./shared/services/middlewares/ScheduleMiddleware.cjs")
const ScheduleController = require("./Barbershop/services/controllers/ScheduleController.cjs")
const DataController = require("./Client/services/controllers/DataController.cjs")
const UpdateUserController = require("./shared/services/controllers/UpdateUserController.cjs")
const UpdateController = require("./Barbershop/services/controllers/UpdateController.cjs")
const DeleteController = require("./Barbershop/services/controllers/DeleteController.cjs")
const DeleteAccount = require("./shared/services/controllers/DeleteAccount.cjs");

// Configuração do middleware cors
const corsOptions = {
	origin: ["https://meu-barber-vite.vercel.app", "http://localhost:3000"], // Troque para a URL do seu aplicativo React em produção
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204
};

const port = process.env.REACT_APP_PORT || 3001;

app.use(cors(corsOptions)); // Use o middleware cors com as opções configuradas
app.use(express.json());
// #########  client routes ##########
app.use("/admin", authenticateMiddleware, AdminController);
app.use("/auth", AuthController);
app.use("/dataUser", authenticateMiddleware, DataController)
// ######################################

// #########  shared routes ##########
app.use("/updateUser", UpdateUserController);
app.use("/emailAuth", VerifyEmail);
app.use("/confirmationFromEmail", ConfirmationSchedule)
app.use("/imageController", ImagesController)
app.use("/deleteAccount", DeleteAccount)
// ######################################

// #########  barbershop routes ########## 
app.use("/barberAuth", BarberAuthController);
app.use("/dataBarber", authenticateMiddleware, DataBarberController);
app.use("/updateDependenciesBarbershop", UpdateController);
app.use("/deleteDependenciesBarbershop", DeleteController);
app.use("/authToken", authenticateMiddleware);
app.use("/calendar", scheduleMiddleware, ScheduleController);

// ############################################


app.use("/picture", express.static(path.join(__dirname, './uploads')))

app.listen(port, () => {
	console.log("Servidor rodando na porta 3001");
});
