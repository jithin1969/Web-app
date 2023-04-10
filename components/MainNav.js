import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useRouter } from 'next/router'
import { useAtom } from 'jotai';
import Link from "next/link"
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useState } from 'react'
import { searchHistoryAtom } from '../store';
import { addToHistory } from '../lib/userData';
import { readToken, removeToken } from '@/lib/authenticate';

export default function MainNav() {

    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)

    const [isExpanded, setisExpanded] = useState(false);

    let token = readToken();

    const router = useRouter();

    function logout() {
        setisExpanded(expand => expand = false);
        removeToken();
        router.push('/login');
    }

    async function submitForm(e) {
        e.preventDefault();
        setisExpanded(expand => expand = false);
        setSearchHistory(await addToHistory(`title=true&q=${e.target.search.value}`));
        router.push(`/artwork?title=true&q=${e.target.search.value}`)
    }

    function toggleNav(e) {
        setisExpanded(expand => expand = !expand);
    }

    function handleNavLinkClick() {
        setisExpanded(false);
    }

    return (
        <>
            <Navbar expanded={isExpanded} bg="light" expand="lg" className="fixed-top navbar-dark bg-dark">
                <Container>
                    <Navbar.Brand>Jithin Biju</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleNav} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link href="/" passHref legacyBehavior >
                                <Nav.Link href="/" onClick={handleNavLinkClick}>Home</Nav.Link>
                            </Link>
                            {token ? (<Link href="/search" passHref legacyBehavior >
                                <Nav.Link href="/search" onClick={handleNavLinkClick}>Advanced Search</Nav.Link>
                            </Link>) : ''}
                        </Nav>
                        &nbsp;{token ? (<Form className="d-flex" onSubmit={submitForm}>
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                name="search"
                            />
                            <Button variant="outline-light" type="submit">Search</Button>
                        </Form>) : ''}&nbsp;
                        {token ? (<Nav>
                            <NavDropdown active={router.pathname === "/history"} title={token.userName} id="basic-nav-dropdown">
                                <Link href="/favourites" passHref legacyBehavior >
                                    <NavDropdown.Item href="/favourites" onClick={handleNavLinkClick}>Favourites</NavDropdown.Item>
                                </Link>
                                <Link href="/history" passHref legacyBehavior >
                                    <NavDropdown.Item href="/history" onClick={handleNavLinkClick}>Search History</NavDropdown.Item>
                                </Link>
                                <Link href="/" passHref legacyBehavior >
                                    <NavDropdown.Item href="/" onClick={logout}>Logout</NavDropdown.Item>
                                </Link>
                            </NavDropdown>
                        </Nav>)
                            :
                            (<Nav>
                                <Link href="/register" passHref legacyBehavior >
                                    <Nav.Link href="/register" onClick={handleNavLinkClick}>Register</Nav.Link>
                                </Link>
                                <Link href="/login" passHref legacyBehavior >
                                    <Nav.Link href="/login" onClick={handleNavLinkClick}>Log in</Nav.Link>
                                </Link>
                            </Nav>)}
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <br />
            <br />
        </>
    );
}