import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Col, Card, CardBody, CardFooter, CardImg, Badge } from "reactstrap"

const PokeTarjeta = (params) => {
    const [pokemon, setPokemon] = useState({});
    const [imagen, setImagen] = useState('');
    const [cardClass, setCardClass] = useState('d-none');
    const [loadClass, setLoadClass] = useState('');
    const [movimientos, setMovimientos] = useState([]);

    useEffect(() => {
        getPokemon();
        getPokemonMoves();
    }, [])

    const getPokemon = async () => {
        const url = params.poke.url;
        axios.get(url).then(async (response) => {
            const respuesta = response.data;
            setPokemon(respuesta);

            if (respuesta.sprites.other.dream_world.front_default != null) {
                setImagen(respuesta.sprites.other.dream_world.front_default);
            } else {
                setImagen(respuesta.sprites.other['official-artwork'].front_default);
            }

            setCardClass('')
            setLoadClass('d-none')
        })
    }

    const getPokemonMoves = async () => {
        const url = params.poke.url;
        const response = await axios.get(url);
        const dataPokemons = response.data;

        const movimientos = [];

        // Se recorren los primeros 4 movimientos del Pokémon
        const movesLimit = Math.min(dataPokemons.moves.length, 4);
        for (let i = 0; i < movesLimit; i++) {
            const moveEntry = dataPokemons.moves[i];
            const enlaceMovimiento = moveEntry.move.url;
            const movimientoRespuesta = await axios.get(enlaceMovimiento);
            const datosMovimiento = movimientoRespuesta.data;

            // Buscamos el nombre en español (language.name === "es")
            const nombreEnEspañol = datosMovimiento.names.find(n => n.language.name === "es");

            const movimiento = nombreEnEspañol ? nombreEnEspañol.name : moveEntry.move.name;
            movimientos.push(movimiento);
        }

        setMovimientos(movimientos);
    };

    return (
        <Col sm='6' md='4' lg='3' className="mb-4">
            <Card className={"shadow " + loadClass} style={{ border: 'none' }}>
                <CardImg src="/img/loading.gif" height="250" className="p-3"></CardImg>
            </Card>
            <Card className={"pokemon-card " + cardClass} style={{
                borderRadius: '20px',
                border: '12px solid #f4d03f',
                background: 'linear-gradient(to bottom, #fef9e7 0%, #fcf3cf 100%)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Header con nombre y HP */}
                <div style={{
                    padding: '12px 15px 8px',
                    background: 'transparent'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <h4 className="text-capitalize mb-0" style={{
                            fontWeight: 'bold',
                            fontSize: '24px',
                            color: '#2c3e50'
                        }}>
                            {pokemon.name}
                        </h4>
                        <div style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#e74c3c'
                        }}>
                            HP {pokemon.stats?.[0]?.base_stat || 50}
                        </div>
                    </div>
                </div>

                {/* Marco de imagen azul celeste */}
                <div style={{
                    margin: '0 15px',
                    background: 'linear-gradient(135deg, #85d8f5 0%, #a8e6ff 100%)',
                    backgroundImage: 'url(/img/fondo_tarjeta.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'soft-light',
                    borderRadius: '12px',
                    padding: '15px',
                    border: '3px solid #333',
                    position: 'relative',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <CardImg src={imagen} style={{
                        maxHeight: '180px',
                        objectFit: 'contain',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                    }} />

                </div>

                {/* Sección de ataques/info */}
                <CardBody style={{
                    padding: '15px',
                    background: 'linear-gradient(to bottom, rgba(255,140,0,0.15) 0%, rgba(255,100,0,0.25) 100%)'
                }}>
                    <div style={{
                        marginBottom: '12px',
                        padding: '10px',
                        background: 'rgba(255,255,255,0.7)',
                        borderRadius: '8px'
                    }}>
                        {movimientos.map((mov, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: index < movimientos.length - 1 ? '6px' : '5px'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: '#ff5722',
                                    border: '2px solid #333'
                                }}></div>
                                <span style={{ color: '#2c3e50', fontSize: '14px', textTransform: 'capitalize' }}>
                                    {mov || 'Movimiento'}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardBody>

                {/* Footer */}
                <CardFooter style={{
                    background: 'rgba(200,200,200,0.4)',
                    padding: '8px 15px',
                    fontSize: '11px',
                    color: '#555',
                    borderTop: '2px solid #999'
                }}>
                    <div className="d-flex justify-content-between align-items-center">
                        <strong style={{ color: '#666', display: 'block', marginTop: '8px' }}>
                            Peso: {(pokemon.weight / 10).toFixed(1)} kg | Altura: {(pokemon.height / 10).toFixed(1)} m
                        </strong>
                        <Link className="btn btn-sm" style={{
                            background: '#3498db',
                            color: 'white',
                            border: '2px solid #2c3e50',
                            fontWeight: 'bold',
                            borderRadius: '6px',
                            padding: '4px 12px'
                        }}>
                            <i className="fa-solid fa-circle-info"></i> Detalle
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </Col>
    )
}

export default PokeTarjeta
