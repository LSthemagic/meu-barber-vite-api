const bcrypt = require("bcryptjs");
// Middleware de atualizar senha
const updatePassword = (Model) => {
    return async (req, res, next) => {
        const { id, password } = req.body;
        try {
            const user = await Model.findById(id).select("+password");
            if (!user) {
                return res.status(404).json({
                    error: true,
                    message: "Usuário inexistente."
                });
            }
            if (await bcrypt.compare(password, user.password)) {
                return res.status(400).json({
                    error: true,
                    message: "A senha precisa ser diferente da anterior."
                });
            }
            // Verificar se a senha tem letra maiúscula, minúscula, caractere especial e número
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!regex.test(password)) {
                return res.status(400).json({
                    error: true,
                    message: "A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um caractere especial."
                });
            }
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: true,
                message: "Internal server error"
            });
        }
    };
};

module.exports = updatePassword;