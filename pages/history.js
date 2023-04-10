import { searchHistoryAtom, favouritesAtom } from '../store';
import { useRouter } from 'next/router'
import { useAtom } from 'jotai';
import { Card, ListGroup, Button, Col } from 'react-bootstrap';
import styles from '@/styles/History.module.css';
import { removeFromHistory } from '../lib/userData'

export default function History() {
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [favouritesList] = useAtom(favouritesAtom);

    let parsedHistory = [];

    searchHistory.forEach(h => {
        let params = new URLSearchParams(h);
        let entries = params.entries();
        parsedHistory.push(Object.fromEntries(entries));
    });

    const router = useRouter();
    if (!favouritesList) return null;

    function historyClicked(e, index) {
        router.push(`/artwork?${searchHistory[index]}`);
    }

    async function removeHistoryClicked(e, index) {
        e.stopPropagation(); // stop the event from trigging other events
        setSearchHistory(await removeFromHistory(searchHistory[index]));

    }

    return (
        <>
            {parsedHistory.length ? (
                <ListGroup>
                    {parsedHistory.map((historyItem, index) => (
                        <ListGroup.Item
                            key={index}
                            onClick={e => historyClicked(e, index)}
                            className={styles.historyListItem}
                        >
                            {Object.keys(historyItem).map(key => (<>{key}: <strong>{historyItem[key]}</strong>&nbsp;</>))}
                            <Button
                                className="float-end"
                                variant="danger"
                                size="sm"
                                onClick={e => removeHistoryClicked(e, index)}
                            >
                                &times;
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <Col lg={12}>
                    <Card>
                        <Card.Body>
                            <h4>Nothing Here</h4>
                            Try searching for some artwork.
                        </Card.Body>
                    </Card>
                </Col>
            )}
        </>
    );

}