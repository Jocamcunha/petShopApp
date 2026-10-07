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

        if (
            email.trim() === "" ||
            senha.trim() === ""
        ) {

            Alert.alert(
                "Campos incompletos",
                "Preencha seu e-mail e sua senha."
            );

            return;

        }

        try {

            await cadastrar(
                email.trim(),
                senha
            );

            Alert.alert(
                "Conta criada!",
                "Seu cadastro foi realizado com sucesso.",
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
                "Não foi possível criar a conta",
                "Confira o e-mail informado e verifique se a senha possui pelo menos 6 caracteres."
            );

            console.log(error);

        }

    }

    return (

        <SafeAreaView style={styles.container}>

            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.logo}>

                    <Text style={styles.logoEmoji}>
                        🐶
                    </Text>

                </View>

                <View style={styles.header}>

                    <Text style={styles.titulo}>
                        Crie sua conta
                    </Text>

                    <Text style={styles.subtitulo}>
                        Entre para o PetShop e cuide
                        ainda melhor do seu melhor amigo.
                    </Text>

                </View>

                <View style={styles.card}>

                    <Text style={styles.cardTitulo}>
                        Vamos começar
                    </Text>

                    <Text style={styles.cardSubtitulo}>
                        Informe seus dados para criar sua conta.
                    </Text>

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
                    />

                    <Text style={styles.label}>
                        Senha
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Crie uma senha"
                        placeholderTextColor="#94A3B8"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={styles.dica}>
                        A senha deve possuir pelo menos 6 caracteres.
                    </Text>

                    <TouchableOpacity
                        style={styles.botaoPrincipal}
                        onPress={realizarCadastro}
                        activeOpacity={0.85}
                    >

                        <Text style={styles.botaoPrincipalTexto}>
                            Criar minha conta
                        </Text>

                    </TouchableOpacity>

                    <View style={styles.divisor} />

                    <Text style={styles.rodapeTexto}>
                        Já possui uma conta?
                    </Text>

                    <TouchableOpacity
                        style={styles.botaoSecundario}
                        onPress={() =>
                            navigation.navigate("Login")
                        }
                        activeOpacity={0.85}
                    >

                        <Text style={styles.botaoSecundarioTexto}>
                            Acessar minha conta
                        </Text>

                    </TouchableOpacity>

                </View>

                <Text style={styles.frase}>
                    🐾 Seu pet merece todo esse carinho.
                </Text>

            </ScrollView>

        </SafeAreaView>

    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    scroll: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingVertical: 28,
    },

    logo: {
        width: 66,
        height: 66,
        borderRadius: 21,
        backgroundColor: "#F97316",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 15,
        borderWidth: 5,
        borderColor: "#FFEDD5",
    },

    logoEmoji: {
        fontSize: 31,
    },

    header: {
        alignItems: "center",
        marginBottom: 18,
    },

    titulo: {
        fontSize: 27,
        fontWeight: "800",
        color: "#172554",
        marginBottom: 5,
    },

    subtitulo: {
        maxWidth: 315,
        textAlign: "center",
        color: "#64748B",
        fontSize: 12,
        lineHeight: 17,
    },

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 9,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        elevation: 3,
    },

    cardTitulo: {
        fontSize: 19,
        fontWeight: "800",
        color: "#172554",
        marginBottom: 3,
    },

    cardSubtitulo: {
        fontSize: 11,
        color: "#64748B",
        marginBottom: 18,
    },

    label: {
        fontSize: 11,
        fontWeight: "700",
        color: "#334155",
        marginBottom: 6,
    },

    input: {
        height: 47,
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        paddingHorizontal: 13,
        color: "#172554",
        fontSize: 13,
        marginBottom: 8,
    },

    dica: {
        fontSize: 9,
        color: "#94A3B8",
        marginBottom: 13,
    },

    botaoPrincipal: {
        height: 48,
        backgroundColor: "#F97316",
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
    },

    botaoPrincipalTexto: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
    },

    divisor: {
        height: 1,
        backgroundColor: "#E2E8F0",
        marginVertical: 17,
    },

    rodapeTexto: {
        textAlign: "center",
        color: "#94A3B8",
        fontSize: 10,
        marginBottom: 9,
    },

    botaoSecundario: {
        height: 45,
        backgroundColor: "#FFF7ED",
        borderWidth: 1,
        borderColor: "#FED7AA",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    botaoSecundarioTexto: {
        color: "#F97316",
        fontSize: 12,
        fontWeight: "800",
    },

    frase: {
        textAlign: "center",
        color: "#94A3B8",
        fontSize: 9,
        marginTop: 15,
    },

});