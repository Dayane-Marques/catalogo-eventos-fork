import { Request, Response } from "express";

//const req = {body: {email: ''}} as unknown as Request;

function mockResponse() {
    const res = {} as Partial<Response>;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response & {
        status: jest.Mock;
        json: jest.Mock;
    };
}

const req = {
    body: {
        titulo: "Festival Gastronômico do Centro",
        cat: "Gastronomia",
        data: "2025-09-20",
        hora: "18:00",
        local: "Rua Ponciano, Centro",
        preco: "Gratuito",
        img: "https://douradosagora.com.br/media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
        desc: "Barracas, food trucks e música ao vivo com artistas locais."
    }
} as unknown as Request;

class CriarEventosController {
    async handle(req: Request, rest: Response): Promise<Response> {

        //Lógica do controlador (exemplo)
        if (!req.body?.titulo) {
            return rest.status(400).json({ error: 'Dados inválidos para a criação do evento' });
        };

        return rest.status(201).json({ message: 'Evento criado com sucesso' })
    }
}


//Suite de testes para criar criar-evento-controller.ts

describe('CriarEventosController', () => {

    //Testa um cenário exemplo.
    it('should create an instance', () => {

        //Exemplo simples de teste.
        expect(true).toBe(true);
    });

    it('should handle event creation', async () => {

        //Arrange do teste
        const controller = new CriarEventosController();
        const req = {
            body: {
                titulo: "Festival Gastronômico do Centro",
                cat: "Gastronomia",
                data: "2025-09-20",
                hora: "18:00",
                local: "Rua Ponciano, Centro",
                preco: "Gratuito",
                img: "https://douradosagora.com.br/media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
                desc: "Barracas, food trucks e música ao vivo com artistas locais."
            }
        } as unknown as Request; //Mock da requisição
        const res = mockResponse();

        //Act
        await controller.handle(req, res);

        //Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Evento criado com sucesso' })
    });


    it('should fail to create event whith invalid data', async () => {
        const controller = new CriarEventosController();
        const req = {
            body: {
                titulo: "", //Titulo inválido.                               
                cat: "Gastronomia",
                data: "2025-09-20",
                hora: "18:00",
                local: "Rua Ponciano, Centro",
                preco: "Gratuito",
                img: "https://douradosagora.com.br/media/posts/390241/dourados-tera-neste-sabado-balaio-festival-com-musica-arte-gastronomia-e-cultura-17522582977313.jpg",
                desc: "Barracas, food trucks e música ao vivo com artistas locais."
            }
        } as unknown as Request; //Mock da requisição com dados iválidos.

        const res = mockResponse();

        await controller.handle(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Dados inválidos para a criação do evento' });
    });
});