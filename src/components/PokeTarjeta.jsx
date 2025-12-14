import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Col, Card, CardBody, CardFooter, CardImg, Badge } from "reactstrap"
import "./PokeTarjeta.css"
import loadingGif from "../assets/img/loading.gif"

const PokeTarjeta = ({ poke }) => {
    const [pokemon, setPokemon] = useState({});
    const [imagen, setImagen] = useState('');
    const [movimientos, setMovimientos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFlipped, setIsFlipped] = useState(false);
    const [stats, setStats] = useState({});

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
            await getTiposPokemon(data.types);
            await getStatsPokemon(data.stats);

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

    const getTiposPokemon = async (tipos) => {
        try {
            const tiposData = tipos.map(async (t) => {
                const response = await axios.get(t.type.url);
                const tiposEnEspañol = response.data.names.find(n => n.language.name === "es");
                return {
                    nombre: tiposEnEspañol ? tiposEnEspañol.name : t.type.name,
                    nombreOriginal: t.type.name
                };
            });

            const tiposRespuesta = await Promise.all(tiposData);
            setTipos(tiposRespuesta);
        } catch (error) {
            console.error("Error al cargar tipos:", error);
        }
    }

    const getStatsPokemon = async (stats) => {
        try {
            const statsData = {};
            stats.forEach((s) => {
                statsData[s.stat.name] = s.base_stat;
            });
            setStats(statsData);
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        }
    }

    if (isLoading) {
        return (
            <Col sm="6" md="4" lg="3" className="mb-4">
                <Card className="pokemon-card-loading">
                    <CardImg src={loadingGif} height="250" className="p-3" alt="Cargando..." />
                </Card>
            </Col>
        );
    }

    return (
        <Col sm="6" md="4" lg="3" className="mb-4">
            <div className={`pokemon-card-container ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
                {/* CARA FRONTAL */}
                <Card className="pokemon-card pokemon-card-front shadow-lg">
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

                    {/* Footer */}
                    <CardFooter className="pokemon-card-footer bg-light">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div className="d-flex gap-2 mb-2 mb-sm-0">
                                {tipos.map((tipo, index) => (
                                    <Badge 
                                        key={index} 
                                        pill 
                                        className="text-capitalize"
                                        style={{
                                            backgroundColor: '#4a4a4a',
                                            fontSize: '11px',
                                            padding: '5px 10px'
                                        }}
                                    >
                                        {tipo.nombre}
                                    </Badge>
                                ))}
                            </div>
                            <small className="text-muted">
                                {(pokemon.weight / 10).toFixed(1)}kg • {(pokemon.height / 10).toFixed(1)}m
                            </small>
                        </div>
                    </CardFooter>
                </Card>

                {/* CARA TRASERA */}
                <Card className="pokemon-card pokemon-card-back shadow-lg">
                    {/* Header */}
                    <div className="p-3 text-center" style={{
                        borderBottom: '2px solid #d4ac0d'
                    }}>
                        <h4 className="text-capitalize fw-bold mb-1 text-dark">
                            {pokemon.name}
                        </h4>
                        <Badge color="dark" pill>
                            #{pokemon.id?.toString().padStart(3, '0')}
                        </Badge>
                    </div>

                    {/* Contenido trasero */}
                    <CardBody className="p-3" style={{ overflowY: 'auto', maxHeight: '400px' }}>

                        {/* Estadísticas */}
                        <div>
                            <div className="d-flex align-items-center justify-content-center mb-3">
                                <h6 className="fw-bold text-dark mb-0">
                                    <i className="fa-solid fa-chart-simple me-2"></i>
                                    Estadísticas
                                </h6>
                            </div>
                            <div className="rounded p-2 bg-white border border-secondary">
                                <div className="row g-2">
                                {stats && Object.keys(stats).map((key, index) => {
                                    const nombreStats = {
                                        hp: 'HP',
                                        attack: 'Ataque',
                                        defense: 'Defensa',
                                        'special-attack': 'At. Esp',
                                        'special-defense': 'Def. Esp',
                                        speed: 'Velocidad'
                                    };
                                    return (
                                        <div key={index} className="col-6">
                                            <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                                                <small className="fw-bold text-muted text-uppercase" style={{fontSize: '0.7rem'}}>
                                                    {nombreStats[key]}
                                                </small>
                                                <span className="fw-bold text-dark">
                                                    {stats[key]}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>
                        </div>

                        {/* Información adicional */}
                        <div className="mt-3 text-center">
                            <div className="d-flex justify-content-around p-2 rounded bg-light border border-secondary">
                                <div className="text-dark">
                                    <small className="d-block fw-bold">Peso</small>
                                    <small>{(pokemon.weight / 10).toFixed(1)} kg</small>
                                </div>
                                <div className="text-dark">
                                    <small className="d-block fw-bold">Altura</small>
                                    <small>{(pokemon.height / 10).toFixed(1)} m</small>
                                </div>
                                <div className="text-dark">
                                    <small className="d-block fw-bold">Exp. Base</small>
                                    <small>{pokemon.base_experience || 0}</small>
                                </div>
                            </div>
                        </div>
                    </CardBody>

                    {/* Footer */}
                    <CardFooter className="text-center py-2 bg-transparent" style={{
                        borderTop: '2px solid #d4ac0d'
                    }}>
                        <small className="text-muted">
                            <i className="fa-solid fa-rotate-left me-2"></i>
                            Haz clic para volver
                        </small>
                    </CardFooter>
                </Card>
            </div>
        </Col>
    )
}

export default PokeTarjeta
