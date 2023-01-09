import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-headless-accordion";

const FAQ = () => {
    return (
        <Accordion>
            <AccordionItem>
                <AccordionHeader>
                    <h3 className={`accordion-title`}>Title 1</h3>
                </AccordionHeader>

                <AccordionBody>
                    <div className="accordion-body">
                        Lorem ipsum dolor sit amet.
                    </div>
                </AccordionBody>
            </AccordionItem>

            <AccordionItem>
                <AccordionHeader>
                    <h3 className={`accordion-title`}>Title 2</h3>
                </AccordionHeader>

                <AccordionBody>
                    <div className="accordion-body">
                        Lorem ipsum dolor sit amet.
                    </div>
                </AccordionBody>
            </AccordionItem>
        </Accordion>
    );
};

export default FAQ;