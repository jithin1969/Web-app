import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { Row, Col, Card, Pagination } from 'react-bootstrap'
import ArtworkCard from '../../components/ArtworkCard';
import validObjectIDList from "../../public/data/validObjectIDList.json"

export default function Artwork() {
    const PER_PAGE = 12

    const [artworkList, setArtworkList] = useState([]);
    const [page, setPage] = useState(1);
    const router = useRouter();
    let finalQuery = router.asPath.split('?')[1];
    const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`);

    useEffect(() => {
        if (data) {
            let results = new Array();
            let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));

            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                results.push(chunk);
            }

            setArtworkList(results);
            setPage(1);
        }
    }, [data]);

    function previousPage() {
        if (page > 1) {
            setPage(pagenum => pagenum - 1);
        }
    }

    function nextPage() {
        if (page < artworkList.length) {
            setPage(pagenum => pagenum + 1);
        }
    }

    if (error) {
        return <Error statusCode={404} />
    }

    if (artworkList) {
        return (
            <>
                <Row className="gy-4">
                    {artworkList.length > 0 ? (
                        artworkList[page - 1].map(currentObjectID => (
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
                {artworkList.length > 0 && (
                    <Row>
                        <Col>
                            <Pagination>
                                <Pagination.Prev onClick={previousPage} />
                                <Pagination.Item active>{page}</Pagination.Item>
                                <Pagination.Next onClick={nextPage} />
                            </Pagination>
                        </Col>
                    </Row>
                )}

            </>
        )
    }
    else {
        return null
    }

}