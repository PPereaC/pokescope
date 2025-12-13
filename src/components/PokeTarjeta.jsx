import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Col, Card, CardBody, CardFooter, CardImg, Badge } from "reactstrap"
import "./PokeTarjeta.css"

const PokeTarjeta = ({ poke }) => {
    const [pokemon, setPokemon] = useState({});
    const [imagen, setImagen] = useState('');
    const [movimientos, setMovimientos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getDatosPokemon();
    }, [])

    const getDatosPokemon = async () => {
        try {
            const response = await axios.get(poke.url);
            const data = response.data;

            setPokemon(data);
            setImagen(getEnlaceImagen(data));
            await getMovimientosPokemon(data.moves);

            setIsLoading(false);
        } catch (error) {
            console.error("Error al cargar el Pokémon:", error);
            setIsLoading(false);
        }
    }

    const getEnlaceImagen = (data) => {
        return data.sprites.other.dream_world.front_default ||
            data.sprites.other['official-artwork'].front_default;
    }

    const getMovimientosPokemon = async (mov) => {
        try {
            const movimientos = mov.slice(0, 4).map(async (m) => {
                const response = await axios.get(m.move.url);
                const movimientoEnEspañol = response.data.names.find(n => n.language.name === "es");
                return movimientoEnEspañol ? movimientoEnEspañol.name : m.move.name;
            });

            const movesData = await Promise.all(movimientos);
            setMovimientos(movesData);
        } catch (error) {
            console.error("Error al cargar movimientos:", error);
        }
    }

    if (isLoading) {
        return (
            <Col sm="6" md="4" lg="3" className="mb-4">
                <Card className="pokemon-card-loading">
                    <CardImg src="/img/loading.gif" height="250" className="p-3" alt="Cargando..." />
                </Card>
            </Col>
        );
    }

    return (
        <Col sm="6" md="4" lg="3" className="mb-4">
            <Card className="pokemon-card shadow-lg">
                {/* Cabecera */}
                <div className="pokemon-card-header p-3">
                    <Badge color="danger" pill className="me-2">
                        #{pokemon.id}
                    </Badge>
                    <h5 className="text-capitalize fw-bold mb-0 flex-grow-1 text-center">
                        {pokemon.name}
                    </h5>
                    <Badge color="danger" pill>
                        HP {pokemon.stats?.[0]?.base_stat}
                    </Badge>
                </div>

                {/* Imagen */}
                <div className="pokemon-card-image-container">
                    <CardImg
                        src={imagen}
                        alt={pokemon.name}
                        className="pokemon-card-image"
                    />
                </div>

                {/* Movimientos */}
                <CardBody className="pokemon-card-body">
                    <div className="bg-white bg-opacity-75 rounded p-3">
                        <h6 className="fw-bold mb-3">Movimientos:</h6>
                        {movimientos.map((movimiento, index) => (
                            <div key={index} className="d-flex align-items-center mb-2">
                                <span className="pokemon-energy-badge me-2"></span>
                                <span className="text-capitalize small">{movimiento}</span>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>
        </Col>
    )
}

export default PokeTarjeta
