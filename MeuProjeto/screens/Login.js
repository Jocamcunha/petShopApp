import React, { useState } from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from "react-native";

import { entrar } from "../services/auth";


export default function Login({ navigation }) {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");


    async function realizarLogin() {

        if (!email || !senha) {

            Alert.alert(
                "Campos incompletos",
                "Preencha todos os campos."
            );

            return;
        }


        try {

            await entrar(email, senha);

            navigation.navigate("Home");

        } catch (error) {

            Alert.alert(
                "Erro ao entrar",
                "E-mail ou senha inválidos."
            );

            console.log(error);
        }
    }


    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >

                {/* TOPO */}

                <View style={styles.topo}>

                    <View style={styles.logo}>
                        <Text style={styles.logoTexto}>
                            🐶
                        </Text>
                    </View>

                    <Text style={styles.titulo}>
                        Seja bem-vindo!
                    </Text>

                    <Text style={styles.subtitulo}>
                        Entre na sua conta e continue
                        cuidando do seu melhor amigo.
                    </Text>

                </View>


                {/* CARD */}

                <View style={styles.card}>

                    <Text style={styles.cardTitulo}>
                        Acesse sua conta 💙
                    </Text>

                    <Text style={styles.cardSubtitulo}>
                        Informe seu e-mail e sua senha.
                    </Text>


                    {/* E-MAIL */}

                    <Text style={styles.label}>
                        E-mail
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu e-mail"
                        placeholderTextColor="#94A3B8"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        blurOnSubmit={false}
                    />


                    {/* SENHA */}

                    <Text style={styles.label}>
                        Senha
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua senha"
                        placeholderTextColor="#94A3B8"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                        blurOnSubmit={false}
                    />


                    {/* BOTÃO LOGIN */}

                    <TouchableOpacity
                        style={styles.botaoPrincipal}
                        onPress={realizarLogin}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.botaoPrincipalTexto}>
                            Entrar 🐾
                        </Text>
                    </TouchableOpacity>


                    {/* IR PARA CADASTRO */}

                    <View style={styles.separador} />

                    <Text style={styles.naoTemConta}>
                        Ainda não possui uma conta?
                    </Text>

                    <TouchableOpacity
                        style={styles.botaoSecundario}
                        onPress={() =>
                            navigation.navigate("Cadastro")
                        }
                        activeOpacity={0.8}
                    >
                        <Text style={styles.botaoSecundarioTexto}>
                            Criar uma conta
                        </Text>
                    </TouchableOpacity>

                </View>


                {/* RODAPÉ */}

                <View style={styles.rodape}>

                    <Text style={styles.rodapeTexto}>
                        🐾 Seu pet merece todo esse carinho!
                    </Text>

                </View>

            </ScrollView>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFF7ED",
    },

    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },


    // TOPO

    topo: {
        alignItems: "center",
        marginBottom: 25,
    },

    logo: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: "#FB7185",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 6,
        borderColor: "#FFE4E6",
    },

    logoTexto: {
        fontSize: 40,
    },

    titulo: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#172554",
        textAlign: "center",
        marginBottom: 8,
    },

    subtitulo: {
        fontSize: 14,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 21,
        maxWidth: 330,
    },


    // CARD

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 22,
        borderWidth: 1,
        borderColor: "#FED7AA",

        elevation: 5,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    cardTitulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 5,
    },

    cardSubtitulo: {
        fontSize: 14,
        color: "#64748B",
        lineHeight: 20,
        marginBottom: 22,
    },


    // CAMPOS

    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 7,
    },

    input: {
        backgroundColor: "#F8FAFC",
        borderWidth: 2,
        borderColor: "#FED7AA",
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 16,
        color: "#172554",
        marginBottom: 18,
    },


    // BOTÕES

    botaoPrincipal: {
        backgroundColor: "#7C3AED",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 5,
    },

    botaoPrincipalTexto: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    separador: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginVertical: 20,
    },

    naoTemConta: {
        textAlign: "center",
        color: "#64748B",
        fontSize: 14,
        marginBottom: 10,
    },

    botaoSecundario: {
        backgroundColor: "#FFF7ED",
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FED7AA",
    },

    botaoSecundarioTexto: {
        color: "#F97316",
        fontSize: 15,
        fontWeight: "bold",
    },


    // RODAPÉ

    rodape: {
        alignItems: "center",
        marginTop: 20,
    },

    rodapeTexto: {
        color: "#94A3B8",
        fontSize: 12,
        textAlign: "center",
    },

});