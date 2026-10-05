import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    Alert,
    Platform,
} from "react-native";

import * as Notifications from "expo-notifications";

import { auth } from "../config/firebase";
import { sair } from "../services/auth";


// =====================================================
// CONFIGURAÇÃO DAS NOTIFICAÇÕES
// =====================================================

if (Platform.OS !== "web") {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
}


// =====================================================
// HOME
// =====================================================

export default function Home({ navigation }) {

    // -----------------------------
    // NAVEGAÇÃO INTERNA
    // -----------------------------

    const [aba, setAba] = useState("home");

    const [servicoSelecionado, setServicoSelecionado] = useState(null);


    // -----------------------------
    // CAMPOS DO AGENDAMENTO
    // -----------------------------

    const [pet, setPet] = useState("");
    const [data, setData] = useState("");
    const [horario, setHorario] = useState("");


    // -----------------------------
    // NOTIFICAÇÕES
    // -----------------------------

    const [notificacoes, setNotificacoes] = useState([]);


    // =================================================
    // DADOS DO USUÁRIO
    // =================================================

    const email = auth.currentUser?.email || "Usuário";

    const nome = email.split("@")[0];


    // =================================================
    // PERMISSÃO PARA NOTIFICAÇÕES
    // =================================================

    useEffect(() => {

        async function configurarNotificacoes() {

            if (Platform.OS === "web") {
                return;
            }

            try {

                if (Platform.OS === "android") {

                    await Notifications.setNotificationChannelAsync(
                        "petshop",
                        {
                            name: "PetShop",
                            importance:
                                Notifications.AndroidImportance.MAX,
                            vibrationPattern: [0, 250, 250, 250],
                        }
                    );

                }

                const { status } =
                    await Notifications.getPermissionsAsync();

                if (status !== "granted") {

                    await Notifications.requestPermissionsAsync();

                }

            } catch (erro) {

                console.log(
                    "Erro nas notificações:",
                    erro
                );

            }

        }

        configurarNotificacoes();

    }, []);


    // =================================================
    // ADICIONAR NOTIFICAÇÃO NA LISTA
    // =================================================

    function adicionarNotificacao(titulo, mensagem) {

        const novaNotificacao = {

            id: Date.now().toString(),

            titulo: titulo,

            mensagem: mensagem,

            horario: new Date().toLocaleTimeString(
                "pt-BR",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            ),

        };


        setNotificacoes((listaAtual) => [

            novaNotificacao,

            ...listaAtual,

        ]);

    }


    // =================================================
    // ENVIAR NOTIFICAÇÃO
    // =================================================

    async function enviarNotificacao(
        titulo,
        mensagem
    ) {

        // Sempre adiciona na lista interna
        adicionarNotificacao(
            titulo,
            mensagem
        );


        // Notificação do sistema somente em
        // Android/iOS
        if (Platform.OS !== "web") {

            try {

                await Notifications.scheduleNotificationAsync({

                    content: {

                        title: titulo,

                        body: mensagem,

                        sound: true,

                    },

                    trigger: null,

                });

            } catch (erro) {

                console.log(
                    "Não foi possível enviar a notificação do sistema:",
                    erro
                );

            }

        }

    }


    // =================================================
    // ABRIR SERVIÇO
    // =================================================

    function abrirServico(tipo) {

        setServicoSelecionado(tipo);

    }


    // =================================================
    // AGENDAR SERVIÇO
    // =================================================

    async function agendarServico() {

        if (
            pet.trim() === "" ||
            data.trim() === "" ||
            horario.trim() === ""
        ) {

            Alert.alert(
                "Campos incompletos",
                "Preencha o nome do pet, a data e o horário."
            );

            return;

        }


        const mensagem =
            `O serviço de ${servicoSelecionado.toLowerCase()} de ${pet} foi agendado para ${data} às ${horario}.`;


        await enviarNotificacao(
            "Agendamento confirmado! 🐾",
            mensagem
        );


        Alert.alert(
            "Tudo certo! 🎉",
            "Seu agendamento foi realizado com sucesso."
        );


        // LIMPA OS CAMPOS

        setPet("");
        setData("");
        setHorario("");


        // Fecha o formulário

        setServicoSelecionado(null);


        // Vai para notificações
        setAba("notificacoes");

    }


    // =================================================
    // COMPRAR PRODUTO
    // =================================================

    async function comprarProduto(
        produto,
        preco
    ) {

        const mensagem =
            `Sua solicitação de compra de ${produto} no valor de ${preco} foi registrada.`;

        await enviarNotificacao(
            "Compra realizada! 🛍️",
            mensagem
        );


        Alert.alert(
            "Compra registrada! 🛍️",
            `Você selecionou ${produto}.`
        );


        setAba("notificacoes");

    }


    // =================================================
    // LOGOUT
    // =================================================

    async function realizarLogout() {

        try {

            await sair();

            navigation.navigate("Login");

        } catch (erro) {

            Alert.alert(
                "Erro",
                "Não foi possível sair da conta."
            );

        }

    }


    // =================================================
    // TELA HOME
    // =================================================

    function renderHome() {

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                {/* CABEÇALHO */}

                <View style={styles.header}>

                    <View style={styles.headerTexto}>

                        <Text style={styles.pequenoTexto}>
                            Bem-vindo(a)! 🐾
                        </Text>

                        <Text style={styles.titulo}>
                            Olá, {nome}!
                        </Text>

                        <Text style={styles.subtitulo}>
                            Tudo para deixar seu pet feliz.
                        </Text>

                    </View>


                    <View style={styles.avatar}>

                        <Text style={styles.avatarTexto}>
                            {nome
                                .charAt(0)
                                .toUpperCase()}
                        </Text>

                    </View>

                </View>


                {/* BANNER */}

                <View style={styles.banner}>

                    <View style={styles.bannerTexto}>

                        <Text style={styles.bannerTitulo}>
                            Amor em cada cuidado! 💙
                        </Text>

                        <Text style={styles.bannerSubtitulo}>
                            Agende serviços, compre produtos
                            e cuide do seu melhor amigo.
                        </Text>

                    </View>

                    <Text style={styles.bannerEmoji}>
                        🐶
                    </Text>

                </View>


                {/* SERVIÇOS */}

                <Text style={styles.secaoTitulo}>
                    O que você deseja fazer?
                </Text>


                <View style={styles.grid}>

                    {/* BANHO */}

                    <TouchableOpacity
                        style={[
                            styles.card,
                            styles.cardAzul
                        ]}
                        onPress={() =>
                            abrirServico("Banho")
                        }
                        activeOpacity={0.8}
                    >

                        <View
                            style={[
                                styles.iconeContainer,
                                styles.iconeAzul
                            ]}
                        >

                            <Text style={styles.icone}>
                                🛁
                            </Text>

                        </View>

                        <Text style={styles.cardTitulo}>
                            Agende seu banho
                        </Text>

                        <Text style={styles.cardDescricao}>
                            Deixe seu pet limpo,
                            cheiroso e confortável.
                        </Text>

                        <Text style={styles.cardLink}>
                            Agendar →
                        </Text>

                    </TouchableOpacity>


                    {/* TOSA */}

                    <TouchableOpacity
                        style={[
                            styles.card,
                            styles.cardRoxo
                        ]}
                        onPress={() =>
                            abrirServico("Tosa")
                        }
                        activeOpacity={0.8}
                    >

                        <View
                            style={[
                                styles.iconeContainer,
                                styles.iconeRoxo
                            ]}
                        >

                            <Text style={styles.icone}>
                                ✂️
                            </Text>

                        </View>

                        <Text style={styles.cardTitulo}>
                            Agende sua tosa
                        </Text>

                        <Text style={styles.cardDescricao}>
                            Deixe seu pet ainda
                            mais bonito e confortável.
                        </Text>

                        <Text style={styles.cardLink}>
                            Agendar →
                        </Text>

                    </TouchableOpacity>


                    {/* CONSULTA */}

                    <TouchableOpacity
                        style={[
                            styles.card,
                            styles.cardVerde
                        ]}
                        onPress={() =>
                            abrirServico("Consulta")
                        }
                        activeOpacity={0.8}
                    >

                        <View
                            style={[
                                styles.iconeContainer,
                                styles.iconeVerde
                            ]}
                        >

                            <Text style={styles.icone}>
                                🩺
                            </Text>

                        </View>

                        <Text style={styles.cardTitulo}>
                            Agende sua consulta
                        </Text>

                        <Text style={styles.cardDescricao}>
                            Cuide da saúde do
                            seu melhor amigo.
                        </Text>

                        <Text style={styles.cardLink}>
                            Agendar →
                        </Text>

                    </TouchableOpacity>


                    {/* PRODUTOS */}

                    <TouchableOpacity
                        style={[
                            styles.card,
                            styles.cardLaranja
                        ]}
                        onPress={() =>
                            setAba("produtos")
                        }
                        activeOpacity={0.8}
                    >

                        <View
                            style={[
                                styles.iconeContainer,
                                styles.iconeLaranja
                            ]}
                        >

                            <Text style={styles.icone}>
                                🛍️
                            </Text>

                        </View>

                        <Text style={styles.cardTitulo}>
                            Compre nossos produtos
                        </Text>

                        <Text style={styles.cardDescricao}>
                            Rações, brinquedos,
                            higiene e muito mais.
                        </Text>

                        <Text style={styles.cardLink}>
                            Ver produtos →
                        </Text>

                    </TouchableOpacity>

                </View>


                {/* CONTA */}

                <View style={styles.contaBox}>

                    <Text style={styles.contaTitulo}>
                        Conta conectada
                    </Text>

                    <Text style={styles.contaEmail}>
                        {email}
                    </Text>

                </View>

            </ScrollView>

        );

    }


    // =================================================
    // TELA DE AGENDAMENTO
    // =================================================

    function renderAgendamento() {

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
            >

                <TouchableOpacity
                    onPress={() =>
                        setServicoSelecionado(null)
                    }
                >

                    <Text style={styles.voltar}>
                        ← Voltar para Home
                    </Text>

                </TouchableOpacity>


                <View style={styles.formHeader}>

                    <Text style={styles.formEmoji}>

                        {servicoSelecionado === "Banho" &&
                            "🛁"}

                        {servicoSelecionado === "Tosa" &&
                            "✂️"}

                        {servicoSelecionado === "Consulta" &&
                            "🩺"}

                    </Text>


                    <View>

                        <Text style={styles.tituloPagina}>
                            Agendar {servicoSelecionado}
                        </Text>

                        <Text style={styles.subtituloPagina}>
                            Preencha os dados abaixo.
                        </Text>

                    </View>

                </View>


                <Text style={styles.label}>
                    Nome do pet
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ex: Thor"
                    placeholderTextColor="#94A3B8"
                    value={pet}
                    onChangeText={setPet}
                    autoCorrect={false}
                    blurOnSubmit={false}
                />


                <Text style={styles.label}>
                    Data
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ex: 10/10/2026"
                    placeholderTextColor="#94A3B8"
                    value={data}
                    onChangeText={setData}
                    keyboardType="numeric"
                    blurOnSubmit={false}
                />


                <Text style={styles.label}>
                    Horário
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Ex: 14:00"
                    placeholderTextColor="#94A3B8"
                    value={horario}
                    onChangeText={setHorario}
                    blurOnSubmit={false}
                />


                {/* RESUMO */}

                <View style={styles.resumo}>

                    <Text style={styles.resumoTitulo}>
                        📋 Resumo
                    </Text>

                    <Text style={styles.resumoTexto}>
                        Serviço: {servicoSelecionado}
                    </Text>

                    <Text style={styles.resumoTexto}>
                        Pet: {pet || "Não informado"}
                    </Text>

                    <Text style={styles.resumoTexto}>
                        Data: {data || "Não informada"}
                    </Text>

                    <Text style={styles.resumoTexto}>
                        Horário: {horario || "Não informado"}
                    </Text>

                </View>


                <TouchableOpacity
                    style={styles.confirmarButton}
                    onPress={agendarServico}
                    activeOpacity={0.8}
                >

                    <Text style={styles.confirmarText}>
                        ✓ Confirmar agendamento
                    </Text>

                </TouchableOpacity>

            </ScrollView>

        );

    }


    // =================================================
    // TELA DE PRODUTOS
    // =================================================

    function renderProdutos() {

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                <TouchableOpacity
                    onPress={() =>
                        setAba("home")
                    }
                >

                    <Text style={styles.voltar}>
                        ← Voltar para Home
                    </Text>

                </TouchableOpacity>


                <Text style={styles.tituloPagina}>
                    🛍️ Nossos produtos
                </Text>

                <Text style={styles.subtituloPagina}>
                    Tudo para cuidar, alimentar e divertir
                    seu melhor amigo.
                </Text>


                {/* PRODUTO 1 */}

                <View style={styles.produtoCard}>

                    <View
                        style={[
                            styles.produtoEmojiBox,
                            styles.produtoAzul
                        ]}
                    >

                        <Text style={styles.produtoEmoji}>
                            🦴
                        </Text>

                    </View>


                    <View style={styles.produtoInfo}>

                        <Text style={styles.produtoNome}>
                            Petisco Natural
                        </Text>

                        <Text style={styles.produtoDescricao}>
                            Petisco saboroso para cães.
                        </Text>

                        <Text style={styles.produtoPreco}>
                            R$ 19,90
                        </Text>


                        <TouchableOpacity
                            style={styles.comprarButton}
                            onPress={() =>
                                comprarProduto(
                                    "Petisco Natural",
                                    "R$ 19,90"
                                )
                            }
                        >

                            <Text style={styles.comprarText}>
                                Comprar
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>


                {/* PRODUTO 2 */}

                <View style={styles.produtoCard}>

                    <View
                        style={[
                            styles.produtoEmojiBox,
                            styles.produtoAmarelo
                        ]}
                    >

                        <Text style={styles.produtoEmoji}>
                            🥫
                        </Text>

                    </View>


                    <View style={styles.produtoInfo}>

                        <Text style={styles.produtoNome}>
                            Ração Premium
                        </Text>

                        <Text style={styles.produtoDescricao}>
                            Alimentação completa e balanceada.
                        </Text>

                        <Text style={styles.produtoPreco}>
                            R$ 89,90
                        </Text>


                        <TouchableOpacity
                            style={styles.comprarButton}
                            onPress={() =>
                                comprarProduto(
                                    "Ração Premium",
                                    "R$ 89,90"
                                )
                            }
                        >

                            <Text style={styles.comprarText}>
                                Comprar
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>


                {/* PRODUTO 3 */}

                <View style={styles.produtoCard}>

                    <View
                        style={[
                            styles.produtoEmojiBox,
                            styles.produtoRoxo
                        ]}
                    >

                        <Text style={styles.produtoEmoji}>
                            🧸
                        </Text>

                    </View>


                    <View style={styles.produtoInfo}>

                        <Text style={styles.produtoNome}>
                            Brinquedo para Pets
                        </Text>

                        <Text style={styles.produtoDescricao}>
                            Diversão para seu melhor amigo.
                        </Text>

                        <Text style={styles.produtoPreco}>
                            R$ 29,90
                        </Text>


                        <TouchableOpacity
                            style={styles.comprarButton}
                            onPress={() =>
                                comprarProduto(
                                    "Brinquedo para Pets",
                                    "R$ 29,90"
                                )
                            }
                        >

                            <Text style={styles.comprarText}>
                                Comprar
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>


                {/* PRODUTO 4 */}

                <View style={styles.produtoCard}>

                    <View
                        style={[
                            styles.produtoEmojiBox,
                            styles.produtoVerde
                        ]}
                    >

                        <Text style={styles.produtoEmoji}>
                            🧴
                        </Text>

                    </View>


                    <View style={styles.produtoInfo}>

                        <Text style={styles.produtoNome}>
                            Shampoo Pet
                        </Text>

                        <Text style={styles.produtoDescricao}>
                            Higiene e cuidado para seu pet.
                        </Text>

                        <Text style={styles.produtoPreco}>
                            R$ 34,90
                        </Text>


                        <TouchableOpacity
                            style={styles.comprarButton}
                            onPress={() =>
                                comprarProduto(
                                    "Shampoo Pet",
                                    "R$ 34,90"
                                )
                            }
                        >

                            <Text style={styles.comprarText}>
                                Comprar
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>

            </ScrollView>

        );

    }


    // =================================================
    // TELA DE NOTIFICAÇÕES
    // =================================================

    function renderNotificacoes() {

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
            >

                <Text style={styles.tituloPagina}>
                    🔔 Notificações
                </Text>

                <Text style={styles.subtituloPagina}>
                    Aqui ficam registrados seus agendamentos
                    e compras.
                </Text>


                {/* CONTADOR */}

                <View style={styles.notificacaoResumo}>

                    <Text style={styles.notificacaoResumoNumero}>
                        {notificacoes.length}
                    </Text>

                    <Text style={styles.notificacaoResumoTexto}>
                        notificação(ões) registrada(s)
                    </Text>

                </View>


                {notificacoes.length === 0 ? (

                    <View style={styles.vazio}>

                        <Text style={styles.vazioEmoji}>
                            🔕
                        </Text>

                        <Text style={styles.vazioTitulo}>
                            Tudo tranquilo por aqui!
                        </Text>

                        <Text style={styles.vazioTexto}>
                            Quando você fizer um agendamento
                            ou uma compra, ela aparecerá aqui.
                        </Text>

                    </View>

                ) : (

                    notificacoes.map(
                        (notificacao) => (

                            <View
                                key={notificacao.id}
                                style={styles.notificacaoCard}
                            >

                                <View
                                    style={
                                        styles.notificacaoIcone
                                    }
                                >

                                    <Text>
                                        {notificacao.titulo.includes(
                                            "Compra"
                                        )
                                            ? "🛍️"
                                            : "🔔"}
                                    </Text>

                                </View>


                                <View
                                    style={
                                        styles.notificacaoConteudo
                                    }
                                >

                                    <Text
                                        style={
                                            styles.notificacaoTitulo
                                        }
                                    >
                                        {notificacao.titulo}
                                    </Text>


                                    <Text
                                        style={
                                            styles.notificacaoMensagem
                                        }
                                    >
                                        {notificacao.mensagem}
                                    </Text>


                                    <Text
                                        style={
                                            styles.notificacaoHorario
                                        }
                                    >
                                        Hoje às{" "}
                                        {notificacao.horario}
                                    </Text>

                                </View>

                            </View>

                        )
                    )

                )}

            </ScrollView>

        );

    }


    // =================================================
    // TELA DE PERFIL
    // =================================================

    function renderPerfil() {

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
            >

                <Text style={styles.tituloPagina}>
                    👤 Meu Perfil
                </Text>

                <Text style={styles.subtituloPagina}>
                    Confira os dados da sua conta.
                </Text>


                <View style={styles.perfilCard}>

                    <View style={styles.perfilAvatar}>

                        <Text style={styles.perfilAvatarTexto}>
                            {nome
                                .charAt(0)
                                .toUpperCase()}
                        </Text>

                    </View>


                    <Text style={styles.perfilNome}>
                        {nome}
                    </Text>


                    <Text style={styles.perfilEmail}>
                        {email}
                    </Text>

                </View>


                <View style={styles.infoPerfil}>

                    <Text style={styles.infoPerfilEmoji}>
                        🐾
                    </Text>

                    <View style={styles.infoPerfilTexto}>

                        <Text style={styles.infoPerfilTitulo}>
                            Cliente PetShop
                        </Text>

                        <Text style={styles.infoPerfilDescricao}>
                            Use o aplicativo para agendar serviços,
                            comprar produtos e receber notificações.
                        </Text>

                    </View>

                </View>


                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={realizarLogout}
                    activeOpacity={0.8}
                >

                    <Text style={styles.logoutText}>
                        🚪 Sair da conta
                    </Text>

                </TouchableOpacity>

            </ScrollView>

        );

    }


    // =================================================
    // DECIDIR QUAL PARTE DA HOME MOSTRAR
    // =================================================

    let conteudo;


    if (servicoSelecionado) {

        conteudo =
            renderAgendamento();

    } else if (aba === "home") {

        conteudo =
            renderHome();

    } else if (aba === "produtos") {

        conteudo =
            renderProdutos();

    } else if (aba === "notificacoes") {

        conteudo =
            renderNotificacoes();

    } else if (aba === "perfil") {

        conteudo =
            renderPerfil();

    }


    // =================================================
    // RENDERIZAÇÃO PRINCIPAL
    // =================================================

    return (

        <SafeAreaView style={styles.container}>

            <View style={styles.conteudo}>
                {conteudo}
            </View>


            {/* MENU INFERIOR */}

            {!servicoSelecionado && (

                <View style={styles.menu}>

                    {/* HOME */}

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            setAba("home")
                        }
                    >

                        <View
                            style={[
                                styles.menuIconBox,
                                aba === "home" &&
                                    styles.menuIconAtivo
                            ]}
                        >

                            <Text style={styles.menuIcon}>
                                🏠
                            </Text>

                        </View>

                        <Text
                            style={[
                                styles.menuTexto,
                                aba === "home" &&
                                    styles.menuTextoAtivo
                            ]}
                        >
                            Home
                        </Text>

                    </TouchableOpacity>


                    {/* NOTIFICAÇÕES */}

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            setAba("notificacoes")
                        }
                    >

                        <View
                            style={[
                                styles.menuIconBox,
                                aba === "notificacoes" &&
                                    styles.menuIconAtivo
                            ]}
                        >

                            <Text style={styles.menuIcon}>
                                🔔
                            </Text>

                            {notificacoes.length > 0 && (

                                <View
                                    style={styles.badge}
                                >

                                    <Text
                                        style={styles.badgeTexto}
                                    >
                                        {notificacoes.length}
                                    </Text>

                                </View>

                            )}

                        </View>

                        <Text
                            style={[
                                styles.menuTexto,
                                aba === "notificacoes" &&
                                    styles.menuTextoAtivo
                            ]}
                        >
                            Notificações
                        </Text>

                    </TouchableOpacity>


                    {/* PERFIL */}

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            setAba("perfil")
                        }
                    >

                        <View
                            style={[
                                styles.menuIconBox,
                                aba === "perfil" &&
                                    styles.menuIconAtivo
                            ]}
                        >

                            <Text style={styles.menuIcon}>
                                👤
                            </Text>

                        </View>

                        <Text
                            style={[
                                styles.menuTexto,
                                aba === "perfil" &&
                                    styles.menuTextoAtivo
                            ]}
                        >
                            Perfil
                        </Text>

                    </TouchableOpacity>

                </View>

            )}

        </SafeAreaView>

    );

}


// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#FFF7ED",
    },

    conteudo: {
        flex: 1,
    },

    scroll: {
        padding: 20,
        paddingBottom: 35,
    },


    // =================================================
    // CABEÇALHO
    // =================================================

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    headerTexto: {
        flex: 1,
        paddingRight: 15,
    },

    pequenoTexto: {
        fontSize: 14,
        color: "#F97316",
        fontWeight: "bold",
        marginBottom: 5,
    },

    titulo: {
        fontSize: 29,
        fontWeight: "bold",
        color: "#172554",
    },

    subtitulo: {
        fontSize: 14,
        color: "#64748B",
        marginTop: 5,
    },


    // =================================================
    // AVATAR
    // =================================================

    avatar: {
        width: 55,
        height: 55,
        borderRadius: 28,
        backgroundColor: "#FB7185",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
        borderColor: "#FFE4E6",
    },

    avatarTexto: {
        color: "#FFF",
        fontSize: 21,
        fontWeight: "bold",
    },


    // =================================================
    // BANNER
    // =================================================

    banner: {
        backgroundColor: "#7C3AED",
        borderRadius: 24,
        padding: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 25,
        overflow: "hidden",
    },

    bannerTexto: {
        flex: 1,
        paddingRight: 10,
    },

    bannerTitulo: {
        color: "#FFF",
        fontSize: 21,
        fontWeight: "bold",
        marginBottom: 8,
    },

    bannerSubtitulo: {
        color: "#EDE9FE",
        fontSize: 14,
        lineHeight: 20,
    },

    bannerEmoji: {
        fontSize: 65,
    },


    // =================================================
    // SERVIÇOS
    // =================================================

    secaoTitulo: {
        fontSize: 21,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 15,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    card: {
        width: "48%",
        borderRadius: 20,
        padding: 16,
        marginBottom: 15,
        minHeight: 215,
        borderWidth: 1,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    cardAzul: {
        backgroundColor: "#EFF6FF",
        borderColor: "#BFDBFE",
    },

    cardRoxo: {
        backgroundColor: "#F5F3FF",
        borderColor: "#DDD6FE",
    },

    cardVerde: {
        backgroundColor: "#ECFDF5",
        borderColor: "#A7F3D0",
    },

    cardLaranja: {
        backgroundColor: "#FFF7ED",
        borderColor: "#FED7AA",
    },

    iconeContainer: {
        width: 52,
        height: 52,
        borderRadius: 17,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },

    iconeAzul: {
        backgroundColor: "#DBEAFE",
    },

    iconeRoxo: {
        backgroundColor: "#EDE9FE",
    },

    iconeVerde: {
        backgroundColor: "#D1FAE5",
    },

    iconeLaranja: {
        backgroundColor: "#FFEDD5",
    },

    icone: {
        fontSize: 28,
    },

    cardTitulo: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 7,
    },

    cardDescricao: {
        fontSize: 13,
        color: "#64748B",
        lineHeight: 18,
        flex: 1,
    },

    cardLink: {
        fontSize: 14,
        color: "#7C3AED",
        fontWeight: "bold",
        marginTop: 12,
    },


    // =================================================
    // CONTA
    // =================================================

    contaBox: {
        backgroundColor: "#FFF",
        borderRadius: 18,
        padding: 17,
        marginTop: 5,
        borderWidth: 1,
        borderColor: "#FED7AA",
    },

    contaTitulo: {
        fontSize: 14,
        color: "#F97316",
        fontWeight: "bold",
        marginBottom: 5,
    },

    contaEmail: {
        fontSize: 14,
        color: "#64748B",
    },


    // =================================================
    // TELAS INTERNAS
    // =================================================

    tituloPagina: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 8,
    },

    subtituloPagina: {
        fontSize: 15,
        color: "#64748B",
        marginBottom: 25,
        lineHeight: 22,
    },

    voltar: {
        fontSize: 16,
        color: "#7C3AED",
        fontWeight: "bold",
        marginBottom: 20,
    },


    // =================================================
    // FORMULÁRIO
    // =================================================

    formHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    formEmoji: {
        fontSize: 45,
        marginRight: 15,
    },

    label: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 7,
    },

    input: {
        backgroundColor: "#FFF",
        borderWidth: 2,
        borderColor: "#DDD6FE",
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 18,
        color: "#172554",
    },

    resumo: {
        backgroundColor: "#EEF2FF",
        borderRadius: 16,
        padding: 17,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "#C7D2FE",
    },

    resumoTitulo: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4338CA",
        marginBottom: 10,
    },

    resumoTexto: {
        fontSize: 14,
        color: "#475569",
        marginBottom: 5,
    },

    confirmarButton: {
        backgroundColor: "#F97316",
        borderRadius: 14,
        padding: 17,
        alignItems: "center",
        marginTop: 5,
    },

    confirmarText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },


    // =================================================
    // PRODUTOS
    // =================================================

    produtoCard: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 15,
        flexDirection: "row",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        elevation: 3,
    },

    produtoEmojiBox: {
        width: 75,
        height: 75,
        borderRadius: 18,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },

    produtoAzul: {
        backgroundColor: "#DBEAFE",
    },

    produtoAmarelo: {
        backgroundColor: "#FEF3C7",
    },

    produtoRoxo: {
        backgroundColor: "#EDE9FE",
    },

    produtoVerde: {
        backgroundColor: "#D1FAE5",
    },

    produtoEmoji: {
        fontSize: 40,
    },

    produtoInfo: {
        flex: 1,
    },

    produtoNome: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 4,
    },

    produtoDescricao: {
        fontSize: 13,
        color: "#64748B",
        marginBottom: 6,
    },

    produtoPreco: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#F97316",
        marginBottom: 9,
    },

    comprarButton: {
        backgroundColor: "#7C3AED",
        paddingVertical: 9,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignSelf: "flex-start",
    },

    comprarText: {
        color: "#FFF",
        fontWeight: "bold",
        fontSize: 13,
    },


    // =================================================
    // NOTIFICAÇÕES
    // =================================================

    notificacaoResumo: {
        backgroundColor: "#7C3AED",
        borderRadius: 18,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    notificacaoResumoNumero: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFF",
        marginRight: 10,
    },

    notificacaoResumoTexto: {
        color: "#EDE9FE",
        fontSize: 14,
    },

    notificacaoCard: {
        backgroundColor: "#FFF",
        borderRadius: 17,
        padding: 15,
        marginBottom: 12,
        flexDirection: "row",
        borderLeftWidth: 5,
        borderLeftColor: "#F97316",
        elevation: 2,
    },

    notificacaoIcone: {
        width: 45,
        height: 45,
        borderRadius: 14,
        backgroundColor: "#FFF7ED",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    notificacaoConteudo: {
        flex: 1,
    },

    notificacaoTitulo: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 5,
    },

    notificacaoMensagem: {
        fontSize: 14,
        color: "#64748B",
        lineHeight: 20,
        marginBottom: 6,
    },

    notificacaoHorario: {
        fontSize: 11,
        color: "#94A3B8",
    },

    vazio: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
        paddingHorizontal: 25,
    },

    vazioEmoji: {
        fontSize: 55,
        marginBottom: 15,
    },

    vazioTitulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 7,
    },

    vazioTexto: {
        color: "#64748B",
        fontSize: 14,
        textAlign: "center",
        lineHeight: 20,
    },


    // =================================================
    // PERFIL
    // =================================================

    perfilCard: {
        backgroundColor: "#FFF",
        borderRadius: 22,
        padding: 25,
        alignItems: "center",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#DDD6FE",
    },

    perfilAvatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#FB7185",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        borderWidth: 5,
        borderColor: "#FFE4E6",
    },

    perfilAvatarTexto: {
        color: "#FFF",
        fontSize: 38,
        fontWeight: "bold",
    },

    perfilNome: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#172554",
        marginBottom: 5,
    },

    perfilEmail: {
        fontSize: 14,
        color: "#64748B",
    },

    infoPerfil: {
        backgroundColor: "#ECFDF5",
        borderRadius: 18,
        padding: 17,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#A7F3D0",
    },

    infoPerfilEmoji: {
        fontSize: 35,
        marginRight: 12,
    },

    infoPerfilTexto: {
        flex: 1,
    },

    infoPerfilTitulo: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#065F46",
        marginBottom: 4,
    },

    infoPerfilDescricao: {
        color: "#047857",
        fontSize: 13,
        lineHeight: 19,
    },

    logoutButton: {
        backgroundColor: "#EF4444",
        padding: 17,
        borderRadius: 14,
        alignItems: "center",
    },

    logoutText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },


    // =================================================
    // MENU
    // =================================================

    menu: {
        height: 78,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        elevation: 10,
    },

    menuItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    menuIconBox: {
        width: 43,
        height: 34,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 3,
        position: "relative",
    },

    menuIconAtivo: {
        backgroundColor: "#EDE9FE",
    },

    menuIcon: {
        fontSize: 21,
    },

    menuTexto: {
        fontSize: 11,
        color: "#64748B",
    },

    menuTextoAtivo: {
        color: "#7C3AED",
        fontWeight: "bold",
    },

    badge: {
        position: "absolute",
        right: 0,
        top: -3,
        backgroundColor: "#EF4444",
        minWidth: 17,
        height: 17,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 3,
    },

    badgeTexto: {
        color: "#FFF",
        fontSize: 9,
        fontWeight: "bold",
    },

});