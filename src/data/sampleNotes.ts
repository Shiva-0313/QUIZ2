export interface SampleNote {
  id: string;
  title: string;
  category: string;
  topic: string;
  snippet: string;
  content: string;
}

export const SAMPLE_STUDY_MATERIALS: SampleNote[] = [
  {
    id: 'ux-design',
    title: 'UX Design Foundations & Heuristics',
    category: 'Design & Tech',
    topic: 'UX Design',
    snippet: 'Core interaction design principles, usability heuristics, Fitts’s Law, and accessibility standards.',
    content: `UX Design Foundations:
Usability refers to how easily and intuitively users can learn and navigate an interface to achieve their goals. The primary goal is reducing cognitive friction and error rates.
Nielsen's 10 Heuristics highlight:
1. Visibility of System Status: Users should always know what is happening through timely visual feedback.
2. Match Between System and the Real World: Use language and concepts familiar to the user rather than system-oriented jargon.
3. User Control and Freedom: Provide clear emergency exits such as undo and cancel.
4. Consistency and Standards: Users should not have to wonder whether different words or actions mean the same thing.
5. Error Prevention: Good design prevents problems from occurring in the first place.
6. Recognition over Recall: Minimize cognitive load by making objects and actions visible.
7. Flexibility and Efficiency: Allow power users to tailor frequent actions with shortcuts.
8. Aesthetic and Minimalist Design: Interfaces should not contain irrelevant or rarely needed info.
9. Help Users Recognize, Diagnose, and Recover from Errors: Clear plain-language error messages.
10. Help and Documentation: Readily accessible, task-oriented assistance.

Fitts's Law states that the time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target.
Miller's Law (7 ± 2 rule) posits that human working memory holds approximately 7 items plus or minus 2.
Accessibility (a11y) benefits everyone, including people with situational, temporary, or permanent impairments.`,
  },
  {
    id: 'biology-cellular',
    title: 'Cellular Respiration & Genetics',
    category: 'Science',
    topic: 'Biology',
    snippet: 'Mitochondrial ATP synthesis, glycolysis, Krebs cycle, and DNA replication mechanisms.',
    content: `Cellular Biology & Genetics Summary:
Cellular respiration is the metabolic process by which cells convert biochemical energy from nutrients into adenosine triphosphate (ATP).
The three primary stages are:
1. Glycolysis: Occurs in the cytoplasm, breaking glucose into two pyruvate molecules without requiring oxygen (anaerobic). Yields a net 2 ATP and 2 NADH.
2. The Krebs Cycle (Citric Acid Cycle): Occurs in the mitochondrial matrix, producing ATP, NADH, and FADH2 while releasing CO2.
3. The Electron Transport Chain & Oxidative Phosphorylation: Takes place on the inner mitochondrial membrane, generating approximately 30-32 ATP via ATP synthase driven by a proton gradient.

Genetics and DNA:
DNA is composed of nucleotide polymers with deoxyribose sugar, phosphate groups, and four nitrogenous bases: Adenine (A), Thymine (T), Guanine (G), and Cytosine (C).
DNA replication is semi-conservative: each daughter molecule contains one parent strand and one newly synthesized strand.
Mitosis results in two genetically identical diploid daughter cells, whereas Meiosis produces four genetically diverse haploid gametes.`,
  },
  {
    id: 'world-history',
    title: 'The Industrial Revolution & Global Trade',
    category: 'History',
    topic: 'World History',
    snippet: 'Steam engine adoption, urbanization, mechanized textile production, and socio-economic shifts.',
    content: `The Industrial Revolution (1760-1840):
Beginning in Great Britain during the late 18th century, the Industrial Revolution transitioned agrarian economies into mechanized, industrial urban societies.
Key drivers:
- James Watt's improvements to the steam engine enabled factories to operate away from rivers.
- Mechanized textile manufacturing through the spinning jenny and power loom drastically increased output.
- Abundant coal and iron ore deposits in Britain fueled energy and structural manufacturing.
- Rapid urbanization led to dense factory towns, transforming demographic distributions and creating a new industrial working class.
- The development of railways lowered transportation costs and integrated national and international markets.`,
  },
  {
    id: 'microeconomics',
    title: 'Microeconomics: Supply, Demand & Elasticity',
    category: 'Economics',
    topic: 'Economics',
    snippet: 'Market equilibrium, price elasticity, opportunity cost, and consumer surplus principles.',
    content: `Microeconomics Core Principles:
1. Law of Demand: As price increases, quantity demanded decreases, ceteris paribus (downward sloping demand curve).
2. Law of Supply: As price increases, quantity supplied increases (upward sloping supply curve).
3. Market Equilibrium: The price at which quantity demanded equals quantity supplied, clearing the market.
4. Price Elasticity of Demand: Measures the responsiveness of quantity demanded to changes in price (% change in Q / % change in P). If absolute value > 1, demand is elastic; if < 1, inelastic.
5. Opportunity Cost: The loss of potential gain from other alternatives when one alternative is chosen.
6. Consumer Surplus: The difference between the total amount consumers are willing to pay and the total amount they actually pay.`,
  },
];
