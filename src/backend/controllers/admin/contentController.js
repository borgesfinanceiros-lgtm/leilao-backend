// src/backend/controllers/admin/contentController.js

const ContentModel = require('../../models/Content');

/** [PUBLIC] Obtém o conteúdo de uma página estática. */
const getPublicContent = async (req, res) => {
    const { slug } = req.params;
    try {
        const content = await ContentModel.findBySlug(slug);
        if (!content) {
            return res.status(404).json({ message: 'Conteúdo não encontrado ou não publicado.' });
        }
        return res.json({ success: true, data: content });
    } catch (error) {
        console.error(`Erro ao buscar conteúdo público (${slug}):`, error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

/** [ADMIN] Cria ou atualiza uma página de conteúdo. */
const saveContent = async (req, res) => {
    const contentData = req.body;
    
    if (!contentData.slug || !contentData.titulo || !contentData.conteudo) {
        return res.status(400).json({ message: 'Slug, título e conteúdo são obrigatórios.' });
    }
    
    contentData.slug = contentData.slug.toLowerCase().replace(/\s/g, '-');

    try {
        const result = await ContentModel.upsert(contentData);
        const action = result.updated ? 'atualizado' : 'criado';
        
        return res.status(200).json({ success: true, message: `Conteúdo ${action} com sucesso!`, id: result.id });
    } catch (error) {
        console.error('Erro ao salvar conteúdo:', error);
        return res.status(500).json({ message: 'Erro interno do servidor ao salvar conteúdo.' });
    }
};

/** [ADMIN] Lista todas as páginas de conteúdo. */
const getAllContentForAdmin = async (req, res) => {
    try {
        const allContent = await ContentModel.findAllForAdmin();
        return res.json({ success: true, data: allContent });
    } catch (error) {
        console.error('Erro ao listar conteúdo para o Admin:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    getPublicContent,
    saveContent,
    getAllContentForAdmin,
};