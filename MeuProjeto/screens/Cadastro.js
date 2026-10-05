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

import { cadastrar } from "../services/auth";


export default function Cadastro({ navigation }) {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");


    async function realizarCadastro() {

        if (!email || !senha) {

            Alert.alert(
                "Campos incompletos",
                "Preencha todos os campos."
            );

            return;
        }


        try {

            await cadastrar(email, senha);

            Alert.alert(
                "Cadastro realizado! 🎉",
                "Seu usuário foi cadastrado com sucesso.",
                [
                    {
                        text: "Continuar",
                        onPress: () =>
                            navigation.navigate("Login"),
                    },
                ]
            );

        } catch (error) {

            Alert.alert(
                "Não foi possível realizar o cadastro",
                "Verifique o e-mail e a senha e tente novamente."
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
                            🐾
                        </Text>
                    </View>

                    <Text style={styles.titulo}>
                        Crie sua conta!
                    </Text>

                    <Text style={styles.subtitulo}>
                        Entre para o PetShop e cuide
                        ainda melhor do seu melhor amigo.
                    </Text>

                </View>


                {/* CARD */}

                <View style={styles.card}>

                    <Text style={styles.cardTitulo}>
                        Vamos começar 🐶
                    </Text>

                    <Text style={styles.cardSubtitulo}>
                        Informe seus dados para criar sua conta.
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


                    {/* BOTÃO CADASTRAR */}

                    <TouchableOpacity
                        style={styles.botaoPrincipal}
                        onPress={realizarCadastro}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.botaoPrincipalTexto}>
                            Criar minha conta 🐾
                        </Text>
                    </TouchableOpacity>


                    {/* IR PARA LOGIN */}

                    <View style={styles.separador} />

                    <Text style={styles.jaTemConta}>
                        Já possui uma conta?
                    </Text>

                    <TouchableOpacity
                        style={styles.botaoSecundario}
                        onPress={() =>
                            navigation.navigate("Login")
                        }
                        activeOpacity={0.8}
                    >
                        <Text style={styles.botaoSecundarioTexto}>
                            Acessar minha conta
                        </Text>
                    </TouchableOpacity>

                </View>


                {/* RODAPÉ */}

                <View style={styles.rodape}>

                    <Text style={styles.rodapeTexto}>
                        🐾 Amor, cuidado e carinho para seu pet.
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
        backgroundColor: "#7C3AED",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 6,
        borderColor: "#EDE9FE",
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
        borderColor: "#DDD6FE",

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
        borderColor: "#DDD6FE",
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 16,
        color: "#172554",
        marginBottom: 18,
    },


    // BOTÕES

    botaoPrincipal: {
        backgroundColor: "#F97316",
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

    jaTemConta: {
        textAlign: "center",
        color: "#64748B",
        fontSize: 14,
        marginBottom: 10,
    },

    botaoSecundario: {
        backgroundColor: "#EDE9FE",
        borderRadius: 14,
        paddingVertical: 15,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#DDD6FE",
    },

    botaoSecundarioTexto: {
        color: "#7C3AED",
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