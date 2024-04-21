import React from "react";
import { BodyShort, Button, Dropdown, Hide, HStack } from "@navikt/ds-react";
import { LeaveIcon, PersonIcon, MenuHamburgerIcon } from '@navikt/aksel-icons';
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

export function LayoutAppbar() {
    const navigate = useNavigate(); // Initialize useNavigate hook

    return (
        <>
            <HStack as="nav" justify="space-between" align="center">
                <a onClick={() => navigate("/")} className="px-2 py-5">
                    <img src={"/img/Novari-big-gray.png"} height={"50px"} alt={"Novari Logo"}/>
                </a>
                <div className="grid h-full">
                    <HStack align="center">
                        <Hide below="md" asChild>
                            <Dropdown>
                                <Button icon={<MenuHamburgerIcon aria-hidden />} variant="tertiary" as={Dropdown.Toggle}>Menu</Button>
                                <Dropdown.Menu>
                                    <Dropdown.Menu.GroupedList.Item onClick={() => navigate("/person")}>Klienter</Dropdown.Menu.GroupedList.Item>
                                    <Dropdown.Menu.GroupedList.Item onClick={() => navigate("/org")}>Adapter</Dropdown.Menu.GroupedList.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Hide>
                        <Hide below="md" asChild>
                            <Button icon={<PersonIcon aria-hidden />} variant="tertiary">
                                <BodyShort weight="semibold" truncate className="max-w-[10vw]">
                                    Din bruker
                                </BodyShort>
                            </Button>
                        </Hide>
                        <Hide below="md" asChild>
                            <Button icon={<LeaveIcon aria-hidden />} variant="tertiary">
                                Logg ut
                            </Button>
                        </Hide>
                    </HStack>
                </div>
            </HStack>
        </>
    );
}
