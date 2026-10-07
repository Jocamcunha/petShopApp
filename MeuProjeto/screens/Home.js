import React, { useEffect, useRef, useState } from "react";

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

export default function Home({ navigation }) {

    const [aba, setAba] = useState("home");

    const [servicoSelecionado, setServicoSelecionado] =
        useState(null);

    const [pet, setPet] = useState("");
    const [data, setData] = useState("");
    const [horario, setHorario] = useState("");

    const [notificacoes, setNotificacoes] = useState([]);

    const [popupVisivel, setPopupVisivel] = useState(false);

    const [popup, setPopup] = useState({
        titulo: "",
        mensagem: "",
        tipo: "",
    });

    const popupTimer = useRef(null);

    const idsNotificacoes = useRef(new Set());

    const email =
        auth.currentUser?.email || "Usuário";

    const nome =
        email.split("@")[0];

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
                            vibrationPattern:
                                [0, 250, 250, 250],
                            sound: "default",
                            enableVibrate: true,
                        }
                    );

                }

                const {
                    status: statusAtual
                } =
                    await Notifications.getPermissionsAsync();

                if (statusAtual !== "granted") {

                    await Notifications.requestPermissionsAsync();

                }

            } catch (erro) {

                console.log(
                    "Erro ao configurar notificações:",
                    erro
                );

            }

        }

        configurarNotificacoes();

    }, []);

    useEffect(() => {

        return () => {

            if (popupTimer.current) {

                clearTimeout(
                    popupTimer.current
                );

            }

        };

    }, []);

    function mostrarPopup(
        titulo,
        mensagem,
        tipo
    ) {

        setPopup({
            titulo,
            mensagem,
            tipo,
        });

        setPopupVisivel(true);

        if (popupTimer.current) {

            clearTimeout(
                popupTimer.current
            );

        }

        popupTimer.current = setTimeout(() => {

            setPopupVisivel(false);

        }, 5000);

    }

    function registrarNotificacao(
        id,
        titulo,
        mensagem,
        tipo
    ) {

        if (
            idsNotificacoes.current.has(id)
        ) {

            return;

        }

        idsNotificacoes.current.add(id);

        const novaNotificacao = {

            id,

            titulo,

            mensagem,

            tipo,

            horario:
                new Date().toLocaleTimeString(
                    "pt-BR",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                    }
                ),

        };

        setNotificacoes(
            listaAtual => [
                novaNotificacao,
                ...listaAtual,
            ]
        );

    }

    useEffect(() => {

        if (Platform.OS === "web") {
            return;
        }

        const subscription =
            Notifications.addNotificationReceivedListener(
                (notification) => {

                    const id =
                        notification.request.identifier;

                    const titulo =
                        notification.request.content.title ||
                        "Notificação";

                    const mensagem =
                        notification.request.content.body ||
                        "Você recebeu uma nova notificação.";

                    const dados =
                        notification.request.content.data ||
                        {};

                    const tipo =
                        dados.tipo ||
                        "geral";

                    registrarNotificacao(
                        id,
                        titulo,
                        mensagem,
                        tipo
                    );

                }
            );

        return () => {

            subscription.remove();

        };

    }, []);

    async function enviarNotificacao(
        titulo,
        mensagem,
        tipo
    ) {

        if (Platform.OS === "web") {

            const id =
                `web-${Date.now()}`;

            registrarNotificacao(
                id,
                titulo,
                mensagem,
                tipo
            );

            mostrarPopup(
                titulo,
                mensagem,
                tipo
            );

            return true;

        }

        try {

            const {
                status
            } =
                await Notifications.getPermissionsAsync();

            if (status !== "granted") {

                Alert.alert(
                    "Permissão necessária",
                    "Ative as notificações para receber as confirmações."
                );

                return false;

            }

            mostrarPopup(
                titulo,
                mensagem,
                tipo
            );

            await Notifications.scheduleNotificationAsync({

                content: {

                    title: titulo,

                    body: mensagem,

                    sound: true,

                    data: {
                        tipo: tipo,
                    },

                },

                trigger: {

                    type:
                        Notifications
                            .SchedulableTriggerInputTypes
                            .TIME_INTERVAL,

                    seconds: 2,

                    ...(Platform.OS === "android"
                        ? {
                            channelId: "petshop",
                        }
                        : {}),

                },

            });

            return true;

        } catch (erro) {

            console.log(
                "Erro ao criar notificação:",
                erro
            );

            Alert.alert(
                "Erro",
                "Não foi possível enviar a notificação."
            );

            return false;

        }

    }

    function abrirServico(tipo) {

        setServicoSelecionado(tipo);

    }

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

        const servico =
            servicoSelecionado.toLowerCase();

        const mensagem =
            `O serviço de ${servico} de ${pet} foi agendado para ${data} às ${horario}.`;

        const sucesso =
            await enviarNotificacao(
                "Agendamento confirmado! 🐾",
                mensagem,
                "agendamento"
            );

        if (!sucesso) {
            return;
        }

        setPet("");
        setData("");
        setHorario("");

        setServicoSelecionado(null);

        setAba("home");

    }

    async function comprarProduto(
        produto,
        preco
    ) {

        const mensagem =
            `Sua compra de ${produto} no valor de ${preco} foi registrada com sucesso.`;

        const sucesso =
            await enviarNotificacao(
                "Compra realizada! 🛍️",
                mensagem,
                "compra"
            );

        if (!sucesso) {
            return;
        }

        setAba("home");

    }

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

    function renderHome() {

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.header}>

                    <View style={styles.headerTexto}>

                        <Text style={styles.saudo}>
                            Bem-vindo(a)! 🐾
                        </Text>

                        <Text style={styles.titulo}>
                            Olá, {nome}!
                        </Text>

                        <Text style={styles.subtitulo}>
                            Tudo para deixar seu pet feliz.
                        </Text>

                    </View>

                    <TouchableOpacity
                        style={styles.sinoTopo}
                        onPress={() =>
                            setAba("notificacoes")
                        }
                        activeOpacity={0.8}
                    >

                        <Text style={styles.sinoTexto}>
                            🔔
                        </Text>

                        {notificacoes.length > 0 && (

                            <View style={styles.badgeTopo}>

                                <Text style={styles.badgeTopoTexto}>
                                    {notificacoes.length}
                                </Text>

                            </View>

                        )}

                    </TouchableOpacity>

                </View>

                <View style={styles.banner}>

                    <View style={styles.bannerTexto}>

                        <Text style={styles.bannerTitulo}>
                            Cuidado que faz bem.
                        </Text>

                        <Text style={styles.bannerSubtitulo}>
                            Agende serviços, compre produtos
                            e cuide do seu melhor amigo.
                        </Text>

                    </View>

                    <View style={styles.bannerIcone}>

                        <Text style={styles.bannerEmoji}>
                            🐶
                        </Text>

                    </View>

                </View>

                <View style={styles.secaoHeader}>

                    <Text style={styles.secaoTitulo}>
                        Serviços
                    </Text>

                    <Text style={styles.secaoSubtitulo}>
                        Escolha um serviço para seu pet
                    </Text>

                </View>

                <View style={styles.grid}>

                    <TouchableOpacity
                        style={[
                            styles.card,
                            styles.cardAzul
                        ]}
                        onPress={() =>
                            abrirServico("Banho")
                        }
                        activeOpacity={0.85}
                    >

                        <View
                            style={[
                                styles.cardIcone,
                                styles.iconAzul
                            ]}
                        >

                            <Text style={styles.cardEmoji}>
                                🛁
                            </Text>

                        </View>

                        <Text style={styles.cardTitulo}>
                            Banho
                        </Text>

                        <Text style={styles.cardDescricao}>
                            Higiene e conforto.
                        </Text>

                        <Text style={styles.cardAcao}>
                            Agendar →
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.card,
                            styles.cardRoxo
                        ]}
                        onPress={() =>
                            abrirServico("Tosa")
                        }
                        activeOpacity={0.85}
                    >

                        <View
                            style={[
                                styles.cardIcone,
                                styles.iconRoxo
                            ]}
                        >

                            <Text style={styles.cardEmoji}>
                                ✂️
                            </Text>

                        </View>

                        <Text style={styles.cardTitulo}>
                            Tosa
                        </Text>

                        <Text style={styles.cardDescricao}>
                            Beleza e bem-estar.
                        </Text>

                        <Text style={styles.cardAcao}>
                            Agendar →
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.card,
                            styles.cardVerde
                        ]}
                        onPress={() =>
                            abrirServico("Consulta")
                        }
                        activeOpacity={0.85}
                    >

                        <View
                            style={[
                                styles.cardIcone,
                                styles.iconVerde
                            ]}
                        >

                            <Text style={styles.cardEmoji}>
                                🩺
                            </Text>

                        </View>

                        <Text style={styles.cardTitulo}>
                            Consulta
                        </Text>

                        <Text style={styles.cardDescricao}>
                            Saúde e acompanhamento.
                        </Text>

                        <Text style={styles.cardAcao}>
                            Agendar →
                        </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.card,
                            styles.cardLaranja
                        ]}
                        onPress={() =>
                            setAba("produtos")
                        }
                        activeOpacity={0.85}
                    >

                        <View
                            style={[
                                styles.cardIcone,
                                styles.iconLaranja
                            ]}
                        >

                            <Text style={styles.cardEmoji}>
                                🛍️
                            </Text>

                        </View>

                        <Text style={styles.cardTitulo}>
                            Produtos
                        </Text>

                        <Text style={styles.cardDescricao}>
                            Tudo para seu pet.
                        </Text>

                        <Text style={styles.cardAcao}>
                            Ver produtos →
                        </Text>

                    </TouchableOpacity>

                </View>

                <View style={styles.contaBox}>

                    <View style={styles.contaCheck}>

                        <Text style={styles.contaCheckTexto}>
                            ✓
                        </Text>

                    </View>

                    <View style={styles.contaInfo}>

                        <Text style={styles.contaTitulo}>
                            Conta conectada
                        </Text>

                        <Text
                            style={styles.contaEmail}
                            numberOfLines={1}
                        >
                            {email}
                        </Text>

                    </View>

                </View>

            </ScrollView>

        );

    }

    function renderAgendamento() {

        const corServico =
            servicoSelecionado === "Banho"
                ? styles.iconAzul
                : servicoSelecionado === "Tosa"
                    ? styles.iconRoxo
                    : styles.iconVerde;

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                <TouchableOpacity
                    onPress={() =>
                        setServicoSelecionado(null)
                    }
                    activeOpacity={0.7}
                >

                    <Text style={styles.voltar}>
                        ← Voltar
                    </Text>

                </TouchableOpacity>

                <View style={styles.paginaHeader}>

                    <View
                        style={[
                            styles.paginaIcone,
                            corServico
                        ]}
                    >

                        <Text style={styles.paginaEmoji}>

                            {servicoSelecionado === "Banho" &&
                                "🛁"}

                            {servicoSelecionado === "Tosa" &&
                                "✂️"}

                            {servicoSelecionado === "Consulta" &&
                                "🩺"}

                        </Text>

                    </View>

                    <View style={styles.paginaHeaderTexto}>

                        <Text style={styles.tituloPagina}>
                            Agendar {servicoSelecionado}
                        </Text>

                        <Text style={styles.subtituloPagina}>
                            Informe os dados do atendimento.
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
                />

                <View style={styles.resumo}>

                    <Text style={styles.resumoTitulo}>
                        Resumo do agendamento
                    </Text>

                    <View style={styles.resumoLinha}>

                        <Text style={styles.resumoLabel}>
                            Serviço
                        </Text>

                        <Text style={styles.resumoValor}>
                            {servicoSelecionado}
                        </Text>

                    </View>

                    <View style={styles.resumoLinha}>

                        <Text style={styles.resumoLabel}>
                            Pet
                        </Text>

                        <Text style={styles.resumoValor}>
                            {pet || "—"}
                        </Text>

                    </View>

                    <View style={styles.resumoLinha}>

                        <Text style={styles.resumoLabel}>
                            Data
                        </Text>

                        <Text style={styles.resumoValor}>
                            {data || "—"}
                        </Text>

                    </View>

                    <View style={styles.resumoLinha}>

                        <Text style={styles.resumoLabel}>
                            Horário
                        </Text>

                        <Text style={styles.resumoValor}>
                            {horario || "—"}
                        </Text>

                    </View>

                </View>

                <TouchableOpacity
                    style={styles.confirmarButton}
                    onPress={agendarServico}
                    activeOpacity={0.85}
                >

                    <Text style={styles.confirmarText}>
                        Confirmar agendamento
                    </Text>

                </TouchableOpacity>

            </ScrollView>

        );

    }

    function renderProdutos() {

        const produtos = [

            {
                nome: "Petisco Natural",
                descricao: "Petisco saboroso para cães.",
                preco: "R$ 19,90",
                emoji: "🦴",
                estilo: styles.iconAzul,
            },

            {
                nome: "Ração Premium",
                descricao: "Alimentação completa e balanceada.",
                preco: "R$ 89,90",
                emoji: "🥫",
                estilo: styles.iconAmarelo,
            },

            {
                nome: "Brinquedo para Pets",
                descricao: "Diversão para seu melhor amigo.",
                preco: "R$ 29,90",
                emoji: "🧸",
                estilo: styles.iconRoxo,
            },

            {
                nome: "Shampoo Pet",
                descricao: "Higiene e cuidado para seu pet.",
                preco: "R$ 34,90",
                emoji: "🧴",
                estilo: styles.iconVerde,
            },

        ];

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                <TouchableOpacity
                    onPress={() =>
                        setAba("home")
                    }
                    activeOpacity={0.7}
                >

                    <Text style={styles.voltar}>
                        ← Voltar
                    </Text>

                </TouchableOpacity>

                <Text style={styles.tituloPagina}>
                    Produtos
                </Text>

                <Text style={styles.subtituloPagina}>
                    Tudo para cuidar do seu melhor amigo.
                </Text>

                {produtos.map(
                    (produto, index) => (

                        <View
                            key={index}
                            style={styles.produtoCard}
                        >

                            <View
                                style={[
                                    styles.produtoIcone,
                                    produto.estilo
                                ]}
                            >

                                <Text style={styles.produtoEmoji}>
                                    {produto.emoji}
                                </Text>

                            </View>

                            <View style={styles.produtoInfo}>

                                <Text style={styles.produtoNome}>
                                    {produto.nome}
                                </Text>

                                <Text style={styles.produtoDescricao}>
                                    {produto.descricao}
                                </Text>

                                <View style={styles.produtoRodape}>

                                    <Text style={styles.produtoPreco}>
                                        {produto.preco}
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.comprarButton}
                                        onPress={() =>
                                            comprarProduto(
                                                produto.nome,
                                                produto.preco
                                            )
                                        }
                                        activeOpacity={0.85}
                                    >

                                        <Text style={styles.comprarText}>
                                            Comprar
                                        </Text>

                                    </TouchableOpacity>

                                </View>

                            </View>

                        </View>

                    )
                )}

            </ScrollView>

        );

    }

    function renderNotificacoes() {

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                <Text style={styles.tituloPagina}>
                    Notificações
                </Text>

                <Text style={styles.subtituloPagina}>
                    Suas confirmações de agendamento e compras.
                </Text>

                <View style={styles.notificacaoResumo}>

                    <View style={styles.notificacaoResumoIcone}>

                        <Text style={styles.notificacaoResumoEmoji}>
                            🔔
                        </Text>

                    </View>

                    <View>

                        <Text style={styles.notificacaoResumoNumero}>
                            {notificacoes.length}
                        </Text>

                        <Text style={styles.notificacaoResumoTexto}>
                            notificações registradas
                        </Text>

                    </View>

                </View>

                {notificacoes.length === 0 ? (

                    <View style={styles.vazio}>

                        <View style={styles.vazioIcone}>

                            <Text style={styles.vazioEmoji}>
                                🔕
                            </Text>

                        </View>

                        <Text style={styles.vazioTitulo}>
                            Nenhuma notificação
                        </Text>

                        <Text style={styles.vazioTexto}>
                            Quando você realizar um agendamento
                            ou uma compra, a confirmação aparecerá aqui.
                        </Text>

                    </View>

                ) : (

                    notificacoes.map(
                        notificacao => (

                            <View
                                key={notificacao.id}
                                style={[
                                    styles.notificacaoCard,

                                    notificacao.tipo === "compra"
                                        ? styles.notificacaoCompra
                                        : styles.notificacaoAgendamento
                                ]}
                            >

                                <View
                                    style={[
                                        styles.notificacaoIcone,

                                        notificacao.tipo === "compra"
                                            ? styles.iconLaranja
                                            : styles.iconRoxo
                                    ]}
                                >

                                    <Text style={styles.notificacaoEmoji}>
                                        {notificacao.tipo === "compra"
                                            ? "🛍️"
                                            : "📅"}
                                    </Text>

                                </View>

                                <View style={styles.notificacaoConteudo}>

                                    <View style={styles.notificacaoTituloLinha}>

                                        <Text style={styles.notificacaoTitulo}>
                                            {notificacao.titulo}
                                        </Text>

                                        <View style={styles.tipoBadge}>

                                            <Text style={styles.tipoBadgeTexto}>
                                                {notificacao.tipo === "compra"
                                                    ? "Compra"
                                                    : "Agendamento"}
                                            </Text>

                                        </View>

                                    </View>

                                    <Text style={styles.notificacaoMensagem}>
                                        {notificacao.mensagem}
                                    </Text>

                                    <Text style={styles.notificacaoHorario}>
                                        Hoje às {notificacao.horario}
                                    </Text>

                                </View>

                            </View>

                        )
                    )

                )}

            </ScrollView>

        );

    }

    function renderPerfil() {

        return (

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >

                <Text style={styles.tituloPagina}>
                    Meu Perfil
                </Text>

                <Text style={styles.subtituloPagina}>
                    Informações da sua conta.
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

                    <View style={styles.infoPerfilIcone}>

                        <Text style={styles.infoPerfilEmoji}>
                            🐾
                        </Text>

                    </View>

                    <View style={styles.infoPerfilTexto}>

                        <Text style={styles.infoPerfilTitulo}>
                            Cliente PetShop
                        </Text>

                        <Text style={styles.infoPerfilDescricao}>
                            Agende serviços, compre produtos
                            e receba suas confirmações.
                        </Text>

                    </View>

                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={realizarLogout}
                    activeOpacity={0.85}
                >

                    <Text style={styles.logoutText}>
                        🚪 Sair da conta
                    </Text>

                </TouchableOpacity>

            </ScrollView>

        );

    }

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

    } else {

        conteudo =
            renderPerfil();

    }

    return (

        <SafeAreaView style={styles.container}>

            <View style={styles.conteudo}>
                {conteudo}
            </View>

            {popupVisivel && (

                <View
                    pointerEvents="box-none"
                    style={styles.popupWrapper}
                >

                    <View
                        style={[
                            styles.popup,

                            popup.tipo === "compra"
                                ? styles.popupCompra
                                : styles.popupAgendamento
                        ]}
                    >

                        <View
                            style={[
                                styles.popupIcone,

                                popup.tipo === "compra"
                                    ? styles.popupIconeCompra
                                    : styles.popupIconeAgendamento
                            ]}
                        >

                            <Text style={styles.popupIconeTexto}>
                                {popup.tipo === "compra"
                                    ? "🛍️"
                                    : "✓"}
                            </Text>

                        </View>

                        <View style={styles.popupConteudo}>

                            <Text style={styles.popupTitulo}>
                                {popup.titulo}
                            </Text>

                            <Text
                                style={styles.popupMensagem}
                                numberOfLines={3}
                            >
                                {popup.mensagem}
                            </Text>

                        </View>

                        <TouchableOpacity
                            style={styles.popupFechar}
                            onPress={() =>
                                setPopupVisivel(false)
                            }
                            activeOpacity={0.7}
                        >

                            <Text style={styles.popupFecharTexto}>
                                ×
                            </Text>

                        </TouchableOpacity>

                    </View>

                </View>

            )}

            {!servicoSelecionado && (

                <View style={styles.menu}>

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            setAba("home")
                        }
                        activeOpacity={0.8}
                    >

                        <View
                            style={[
                                styles.menuIconBox,
                                aba === "home" &&
                                    styles.menuAtivo
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

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            setAba("notificacoes")
                        }
                        activeOpacity={0.8}
                    >

                        <View
                            style={[
                                styles.menuIconBox,
                                aba === "notificacoes" &&
                                    styles.menuAtivo
                            ]}
                        >

                            <Text style={styles.menuIcon}>
                                🔔
                            </Text>

                            {notificacoes.length > 0 && (

                                <View style={styles.badge}>

                                    <Text style={styles.badgeTexto}>
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

                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() =>
                            setAba("perfil")
                        }
                        activeOpacity={0.8}
                    >

                        <View
                            style={[
                                styles.menuIconBox,
                                aba === "perfil" &&
                                    styles.menuAtivo
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

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    conteudo: {
        flex: 1,
    },

    scroll: {
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 28,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 17,
    },

    headerTexto: {
        flex: 1,
        paddingRight: 12,
    },

    saudo: {
        fontSize: 12,
        color: "#7C3AED",
        fontWeight: "700",
        marginBottom: 2,
    },

    titulo: {
        fontSize: 24,
        fontWeight: "800",
        color: "#172554",
    },

    subtitulo: {
        fontSize: 12,
        color: "#64748B",
        marginTop: 3,
    },

    sinoTopo: {
        width: 45,
        height: 45,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        elevation: 2,
    },

    sinoTexto: {
        fontSize: 21,
    },

    badgeTopo: {
        position: "absolute",
        top: -5,
        right: -5,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#EF4444",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#F8FAFC",
        paddingHorizontal: 3,
    },

    badgeTopoTexto: {
        color: "#FFFFFF",
        fontSize: 8,
        fontWeight: "800",
    },

    popupWrapper: {
        position: "absolute",
        top: 10,
        left: 14,
        right: 14,
        zIndex: 9999,
        elevation: 30,
    },

    popup: {
        minHeight: 70,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 11,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOpacity: 0.13,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        elevation: 12,
    },

    popupAgendamento: {
        borderLeftWidth: 4,
        borderLeftColor: "#22C55E",
    },

    popupCompra: {
        borderLeftWidth: 4,
        borderLeftColor: "#F97316",
    },

    popupIcone: {
        width: 42,
        height: 42,
        borderRadius: 13,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    popupIconeAgendamento: {
        backgroundColor: "#DCFCE7",
    },

    popupIconeCompra: {
        backgroundColor: "#FFF7ED",
    },

    popupIconeTexto: {
        fontSize: 20,
        fontWeight: "800",
    },

    popupConteudo: {
        flex: 1,
        paddingRight: 5,
    },

    popupTitulo: {
        fontSize: 13,
        fontWeight: "800",
        color: "#172554",
        marginBottom: 3,
    },

    popupMensagem: {
        fontSize: 10,
        lineHeight: 15,
        color: "#64748B",
    },

    popupFechar: {
        width: 27,
        height: 27,
        borderRadius: 9,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
    },

    popupFecharTexto: {
        color: "#64748B",
        fontSize: 20,
        lineHeight: 23,
    },

    banner: {
        backgroundColor: "#6D28D9",
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 17,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 21,
    },

    bannerTexto: {
        flex: 1,
        paddingRight: 10,
    },

    bannerTitulo: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "800",
        marginBottom: 4,
    },

    bannerSubtitulo: {
        color: "#EDE9FE",
        fontSize: 11,
        lineHeight: 16,
    },

    bannerIcone: {
        width: 53,
        height: 53,
        borderRadius: 17,
        backgroundColor: "rgba(255,255,255,0.14)",
        justifyContent: "center",
        alignItems: "center",
    },

    bannerEmoji: {
        fontSize: 32,
    },

    secaoHeader: {
        marginBottom: 11,
    },

    secaoTitulo: {
        fontSize: 19,
        fontWeight: "800",
        color: "#172554",
    },

    secaoSubtitulo: {
        fontSize: 11,
        color: "#94A3B8",
        marginTop: 2,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    card: {
        width: "48%",
        minHeight: 166,
        borderRadius: 17,
        padding: 13,
        marginBottom: 11,
        borderWidth: 1,
        elevation: 2,
    },

    cardAzul: {
        backgroundColor: "#F4F8FF",
        borderColor: "#DBEAFE",
    },

    cardRoxo: {
        backgroundColor: "#F8F5FF",
        borderColor: "#E9D5FF",
    },

    cardVerde: {
        backgroundColor: "#F3FDF7",
        borderColor: "#D1FAE5",
    },

    cardLaranja: {
        backgroundColor: "#FFFAF5",
        borderColor: "#FED7AA",
    },

    cardIcone: {
        width: 41,
        height: 41,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 11,
    },

    iconAzul: {
        backgroundColor: "#DBEAFE",
    },

    iconRoxo: {
        backgroundColor: "#EDE9FE",
    },

    iconVerde: {
        backgroundColor: "#D1FAE5",
    },

    iconLaranja: {
        backgroundColor: "#FFEDD5",
    },

    iconAmarelo: {
        backgroundColor: "#FEF3C7",
    },

    cardEmoji: {
        fontSize: 21,
    },

    cardTitulo: {
        fontSize: 15,
        fontWeight: "800",
        color: "#172554",
        marginBottom: 4,
    },

    cardDescricao: {
        fontSize: 11,
        lineHeight: 16,
        color: "#64748B",
    },

    cardAcao: {
        marginTop: 10,
        fontSize: 11,
        fontWeight: "800",
        color: "#7C3AED",
    },

    contaBox: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginTop: 2,
    },

    contaCheck: {
        width: 35,
        height: 35,
        borderRadius: 11,
        backgroundColor: "#DCFCE7",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 9,
    },

    contaCheckTexto: {
        color: "#16A34A",
        fontSize: 16,
        fontWeight: "800",
    },

    contaInfo: {
        flex: 1,
    },

    contaTitulo: {
        fontSize: 11,
        fontWeight: "800",
        color: "#172554",
    },

    contaEmail: {
        fontSize: 10,
        color: "#64748B",
        marginTop: 2,
    },

    voltar: {
        color: "#7C3AED",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 17,
    },

    paginaHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 21,
    },

    paginaIcone: {
        width: 51,
        height: 51,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 11,
    },

    paginaEmoji: {
        fontSize: 26,
    },

    paginaHeaderTexto: {
        flex: 1,
    },

    tituloPagina: {
        fontSize: 24,
        fontWeight: "800",
        color: "#172554",
        marginBottom: 4,
    },

    subtituloPagina: {
        fontSize: 11,
        lineHeight: 16,
        color: "#64748B",
        marginBottom: 14,
    },

    label: {
        fontSize: 11,
        fontWeight: "700",
        color: "#334155",
        marginBottom: 6,
    },

    input: {
        height: 46,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        borderRadius: 12,
        paddingHorizontal: 13,
        fontSize: 13,
        color: "#172554",
        marginBottom: 14,
    },

    resumo: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 14,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginBottom: 13,
    },

    resumoTitulo: {
        fontSize: 13,
        fontWeight: "800",
        color: "#172554",
        marginBottom: 10,
    },

    resumoLinha: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 7,
    },

    resumoLabel: {
        fontSize: 10,
        color: "#94A3B8",
    },

    resumoValor: {
        fontSize: 10,
        color: "#334155",
        fontWeight: "700",
    },

    confirmarButton: {
        height: 48,
        borderRadius: 13,
        backgroundColor: "#7C3AED",
        alignItems: "center",
        justifyContent: "center",
    },

    confirmarText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "800",
    },

    produtoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 11,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#E2E8F0",
        flexDirection: "row",
    },

    produtoIcone: {
        width: 57,
        height: 57,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 11,
    },

    produtoEmoji: {
        fontSize: 28,
    },

    produtoInfo: {
        flex: 1,
    },

    produtoNome: {
        fontSize: 13,
        fontWeight: "800",
        color: "#172554",
        marginBottom: 3,
    },

    produtoDescricao: {
        fontSize: 10,
        lineHeight: 15,
        color: "#64748B",
        marginBottom: 7,
    },

    produtoRodape: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    produtoPreco: {
        fontSize: 12,
        fontWeight: "800",
        color: "#F97316",
    },

    comprarButton: {
        backgroundColor: "#7C3AED",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
    },

    comprarText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "800",
    },

    notificacaoResumo: {
        backgroundColor: "#6D28D9",
        borderRadius: 15,
        padding: 13,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 13,
    },

    notificacaoResumoIcone: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.14)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    notificacaoResumoEmoji: {
        fontSize: 20,
    },

    notificacaoResumoNumero: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "800",
    },

    notificacaoResumoTexto: {
        color: "#EDE9FE",
        fontSize: 10,
    },

    notificacaoCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        padding: 12,
        marginBottom: 9,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },

    notificacaoAgendamento: {
        borderLeftWidth: 4,
        borderLeftColor: "#7C3AED",
    },

    notificacaoCompra: {
        borderLeftWidth: 4,
        borderLeftColor: "#F97316",
    },

    notificacaoIcone: {
        width: 41,
        height: 41,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 9,
    },

    notificacaoEmoji: {
        fontSize: 19,
    },

    notificacaoConteudo: {
        flex: 1,
    },

    notificacaoTituloLinha: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 4,
    },

    notificacaoTitulo: {
        flex: 1,
        fontSize: 12,
        fontWeight: "800",
        color: "#172554",
        paddingRight: 5,
    },

    tipoBadge: {
        backgroundColor: "#F1F5F9",
        borderRadius: 6,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },

    tipoBadgeTexto: {
        fontSize: 7,
        fontWeight: "800",
        color: "#64748B",
    },

    notificacaoMensagem: {
        fontSize: 10,
        lineHeight: 15,
        color: "#64748B",
        marginBottom: 4,
    },

    notificacaoHorario: {
        fontSize: 8,
        color: "#94A3B8",
    },

    vazio: {
        alignItems: "center",
        paddingTop: 42,
        paddingHorizontal: 25,
    },

    vazioIcone: {
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor: "#F1F5F9",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },

    vazioEmoji: {
        fontSize: 29,
    },

    vazioTitulo: {
        fontSize: 15,
        fontWeight: "800",
        color: "#172554",
        marginBottom: 5,
    },

    vazioTexto: {
        fontSize: 10,
        lineHeight: 15,
        color: "#64748B",
        textAlign: "center",
    },

    perfilCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 17,
        padding: 21,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E2E8F0",
        marginBottom: 11,
    },

    perfilAvatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#7C3AED",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },

    perfilAvatarTexto: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "800",
    },

    perfilNome: {
        fontSize: 18,
        fontWeight: "800",
        color: "#172554",
        marginBottom: 3,
    },

    perfilEmail: {
        fontSize: 10,
        color: "#64748B",
    },

    infoPerfil: {
        backgroundColor: "#F7F4FF",
        borderRadius: 15,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E9D5FF",
        marginBottom: 13,
    },

    infoPerfilIcone: {
        width: 41,
        height: 41,
        borderRadius: 12,
        backgroundColor: "#EDE9FE",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 9,
    },

    infoPerfilEmoji: {
        fontSize: 20,
    },

    infoPerfilTexto: {
        flex: 1,
    },

    infoPerfilTitulo: {
        fontSize: 12,
        fontWeight: "800",
        color: "#4C1D95",
        marginBottom: 2,
    },

    infoPerfilDescricao: {
        fontSize: 9,
        lineHeight: 14,
        color: "#6D28D9",
    },

    logoutButton: {
        height: 48,
        borderRadius: 13,
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        justifyContent: "center",
        alignItems: "center",
    },

    logoutText: {
        color: "#DC2626",
        fontSize: 12,
        fontWeight: "800",
    },

    menu: {
        height: 66,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E2E8F0",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        elevation: 8,
    },

    menuItem: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    menuIconBox: {
        width: 39,
        height: 29,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 2,
        position: "relative",
    },

    menuAtivo: {
        backgroundColor: "#F3E8FF",
    },

    menuIcon: {
        fontSize: 18,
    },

    menuTexto: {
        fontSize: 9,
        color: "#94A3B8",
        fontWeight: "600",
    },

    menuTextoAtivo: {
        color: "#7C3AED",
        fontWeight: "800",
    },

    badge: {
        position: "absolute",
        right: -2,
        top: -4,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#EF4444",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 2,
        borderWidth: 1.5,
        borderColor: "#FFFFFF",
    },

    badgeTexto: {
        color: "#FFFFFF",
        fontSize: 7,
        fontWeight: "800",
    },

});