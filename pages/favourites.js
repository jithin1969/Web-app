import React from 'react';
import { useAtom } from 'jotai';
import { Row, Col, Card } from 'react-bootstrap';
import ArtworkCard from '../components/ArtworkCard';
import { favouritesAtom } from '../store';

export default function Favourites() {
    const [favouritesList] = useAtom(favouritesAtom);
    if (!favouritesList) return null;

    return (

        <Row className="gy-4">
            {favouritesList.length > 0 ? (
                favouritesList.map(currentObjectID => (
                    <Col lg={3} key={currentObjectID}>
                        <ArtworkCard objectID={currentObjectID} />
                    </Col>
                ))
            ) : (
                <Col lg={12}>
                    <Card>
                        <Card.Body>
                            <h4>Nothing Here</h4>
                            Try searching for something else.
                        </Card.Body>
                    </Card>
                </Col>
            )}
        </Row>

    );
}