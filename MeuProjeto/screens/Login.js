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

            await entrar(
                email.trim(),
                senha
            );

            navigation.navigate("Home");

        } catch (error) {

            Alert.alert(
                "Não foi possível entrar",
                "Confira seu e-mail e sua senha."
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
                        🐾
                    </Text>

                </View>

                <View style={styles.header}>

                    <Text style={styles.titulo}>
                        Bem-vindo!
                    </Text>

                    <Text style={styles.subtitulo}>
                        Entre na sua conta e cuide do seu
                        melhor amigo.
                    </Text>

                </View>

                <View style={styles.card}>

                    <Text style={styles.cardTitulo}>
                        Entrar na conta
                    </Text>

                    <Text style={styles.cardSubtitulo}>
                        Digite seus dados para continuar.
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
                        placeholder="Digite sua senha"
                        placeholderTextColor="#94A3B8"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TouchableOpacity
                        style={styles.botaoPrincipal}
                        onPress={realizarLogin}
                        activeOpacity={0.85}
                    >

                        <Text style={styles.botaoPrincipalTexto}>
                            Entrar
                        </Text>

                    </TouchableOpacity>

                    <View style={styles.divisor} />

                    <Text style={styles.rodapeTexto}>
                        Ainda não possui uma conta?
                    </Text>

                    <TouchableOpacity
                        style={styles.botaoSecundario}
                        onPress={() =>
                            navigation.navigate("Cadastro")
                        }
                        activeOpacity={0.85}
                    >

                        <Text style={styles.botaoSecundarioTexto}>
                            Criar uma conta
                        </Text>

                    </TouchableOpacity>

                </View>

                <Text style={styles.frase}>
                    🐶 Amor, cuidado e carinho para seu pet.
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
        backgroundColor: "#7C3AED",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 15,
        borderWidth: 5,
        borderColor: "#EDE9FE",
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
        maxWidth: 310,
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
        marginBottom: 14,
    },

    botaoPrincipal: {
        height: 48,
        backgroundColor: "#7C3AED",
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 2,
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
        backgroundColor: "#F8FAFC",
        borderWidth: 1,
        borderColor: "#DDD6FE",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },

    botaoSecundarioTexto: {
        color: "#7C3AED",
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