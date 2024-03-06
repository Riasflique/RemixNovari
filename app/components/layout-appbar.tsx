import React from "react";
import {BodyShort, Button, Hide, HStack} from "@navikt/ds-react";
import {LeaveIcon, PersonIcon} from '@navikt/aksel-icons';
import {useLoaderData} from "@remix-run/react";

export function LayoutAppbar() {

    const { displayName } = useLoaderData();

    return (

        <>
                {/*<header className="grid h-20">*/}
                    <HStack as="nav" justify="space-between" align="center">
                        <a href="/" className="px-2 py-5">
                            <img src={"/img/Novari-big-gray.png"} height={"50px"} alt={"Novari Logo"}/>
                        </a>
                        <div className="grid h-full">
                            <HStack align="center">

                                <Hide below="md" asChild>
                                    <Button icon={<PersonIcon aria-hidden />} variant="tertiary">
                                        <BodyShort weight="semibold" truncate className="max-w-[10vw]">
                                            {displayName.fullName}
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
                {/*</header>*/}


        </>


    );
}

