export const enhancedFunctionalDependencies = {
  id: 'functional-dependencies',
  title: 'Functional Dependencies & Decomposition',
  description: 'Functional dependencies, Armstrong\'s axioms, canonical cover, and database decomposition',
  
  explanation: `
Functional dependencies are constraints that describe relationships between attributes in a relational database. A functional dependency X → Y means that for any two tuples, if they have the same values for attributes in X, they must have the same values for attributes in Y. This concept is fundamental to database normalization and design.

Armstrong's axioms provide a complete set of inference rules for deriving new functional dependencies from existing ones. These axioms include reflexivity, augmentation, and transitivity, which form the foundation for determining closure of attribute sets and finding candidate keys.

Database decomposition involves breaking down relations into smaller relations to eliminate redundancy and anomalies. Decomposition must preserve information (lossless join) and dependencies to maintain data integrity. Understanding these concepts is crucial for designing efficient, normalized database schemas.
  `,

  codeExamples: [
    {
      title: 'Functional Dependencies Analysis',
      language: 'sql',
      description: 'Comprehensive analysis of functional dependencies with practical examples and violation detection',
      code: `-- Sample relation to demonstrate functional dependencies
-- EMPLOYEE(emp_id, emp_name, dept_id, dept_name, manager_id, manager_name, salary, project_id, project_name)

CREATE TABLE employee_info (
    emp_id INT,
    emp_name VARCHAR(100),
    dept_id INT,
    dept_name VARCHAR(50),
    manager_id INT,
    manager_name VARCHAR(100),
    salary DECIMAL(10,2),
    project_id INT,
    project_name VARCHAR(100)
);

-- Insert sample data to demonstrate FDs
INSERT INTO employee_info VALUES 
(101, 'John Smith', 10, 'Engineering', 201, 'Alice Johnson', 75000, 1001, 'Web Platform'),
(102, 'Jane Doe', 20, 'Marketing', 202, 'Bob Wilson', 65000, 1002, 'Mobile App'),
(103, 'Mike Chen', 10, 'Engineering', 201, 'Alice Johnson', 70000, 1001, 'Web Platform'),
(104, 'Sarah Kim', 30, 'Sales', 203, 'Carol Brown', 60000, 1003, 'CRM System'),
(105, 'Tom Lee', 20, 'Marketing', 202, 'Bob Wilson', 62000, 1002, 'Mobile App'),
(106, 'Lisa Wang', 10, 'Engineering', 201, 'Alice Johnson', 72000, 1004, 'Analytics Tool');

-- FUNCTIONAL DEPENDENCIES IN THIS RELATION:
-- FD1: emp_id → emp_name, dept_id, manager_id, salary
-- FD2: dept_id → dept_name, manager_id, manager_name  
-- FD3: manager_id → manager_name
-- FD4: project_id → project_name
-- FD5: emp_id, project_id → (all attributes) - composite key

-- 1. DETECTING FUNCTIONAL DEPENDENCY VIOLATIONS
-- Check if emp_id → emp_name holds (should be true)
SELECT emp_id, COUNT(DISTINCT emp_name) as name_count
FROM employee_info
GROUP BY emp_id
HAVING COUNT(DISTINCT emp_name) > 1;
-- Empty result means FD holds

-- Check if dept_id → dept_name holds (should be true)
SELECT dept_id, COUNT(DISTINCT dept_name) as dept_name_count
FROM employee_info  
GROUP BY dept_id
HAVING COUNT(DISTINCT dept_name) > 1;
-- Empty result means FD holds

-- Check if dept_id → manager_name holds (should be true)
SELECT dept_id, COUNT(DISTINCT manager_name) as manager_count
FROM employee_info
GROUP BY dept_id  
HAVING COUNT(DISTINCT manager_name) > 1;
-- Empty result means FD holds

-- 2. FINDING CANDIDATE KEYS
-- Test if {emp_id, project_id} is a candidate key
SELECT emp_id, project_id, COUNT(*) as tuple_count
FROM employee_info
GROUP BY emp_id, project_id
HAVING COUNT(*) > 1;
-- Empty result means it's a superkey

-- Test minimality - check if emp_id alone is a key
SELECT emp_id, COUNT(*) as tuple_count  
FROM employee_info
GROUP BY emp_id
HAVING COUNT(*) > 1;
-- Non-empty result means emp_id alone is not a key

-- Test minimality - check if project_id alone is a key
SELECT project_id, COUNT(*) as tuple_count
FROM employee_info  
GROUP BY project_id
HAVING COUNT(*) > 1;
-- Non-empty result means project_id alone is not a key

-- Therefore {emp_id, project_id} is a candidate key

-- 3. CLOSURE COMPUTATION SIMULATION
-- Find closure of {dept_id} given our FDs
-- dept_id → dept_name, manager_id, manager_name
SELECT DISTINCT dept_id, dept_name, manager_id, manager_name
FROM employee_info
ORDER BY dept_id;

-- Find closure of {emp_id}  
-- emp_id → emp_name, dept_id, manager_id, salary
-- dept_id → dept_name, manager_name (by transitivity)
SELECT DISTINCT emp_id, emp_name, dept_id, dept_name, manager_id, manager_name, salary
FROM employee_info
ORDER BY emp_id;

-- 4. REDUNDANCY DETECTION
-- Identify redundant information due to FD violations
WITH redundant_data AS (
    SELECT dept_id, dept_name, manager_id, manager_name,
           COUNT(*) as occurrence_count
    FROM employee_info
    GROUP BY dept_id, dept_name, manager_id, manager_name
)
SELECT dept_id, dept_name, manager_name, 
       occurrence_count,
       (occurrence_count - 1) as redundant_occurrences
FROM redundant_data
WHERE occurrence_count > 1
ORDER BY occurrence_count DESC;

-- 5. ANOMALY DEMONSTRATION
-- Update anomaly: Changing department name requires multiple updates
UPDATE employee_info 
SET dept_name = 'Software Engineering'
WHERE dept_id = 10;

-- Insertion anomaly: Cannot insert department info without employee
-- This would violate the current schema design

-- Deletion anomaly: Deleting last employee in department loses department info
-- Demonstrate by showing departments that would be lost
SELECT dept_id, dept_name, COUNT(*) as emp_count
FROM employee_info
GROUP BY dept_id, dept_name
HAVING COUNT(*) = 1;

-- 6. FUNCTIONAL DEPENDENCY TESTING QUERIES
-- Generic template for testing FD: X → Y
-- SELECT X, COUNT(DISTINCT Y) FROM table GROUP BY X HAVING COUNT(DISTINCT Y) > 1;

-- Test emp_id → salary
SELECT emp_id, COUNT(DISTINCT salary) as salary_variations
FROM employee_info
GROUP BY emp_id
HAVING COUNT(DISTINCT salary) > 1;

-- Test manager_id → manager_name  
SELECT manager_id, COUNT(DISTINCT manager_name) as name_variations
FROM employee_info
GROUP BY manager_id
HAVING COUNT(DISTINCT manager_name) > 1;

-- Test project_id → project_name
SELECT project_id, COUNT(DISTINCT project_name) as name_variations  
FROM employee_info
GROUP BY project_id
HAVING COUNT(DISTINCT project_name) > 1;

-- 7. MULTIVALUED DEPENDENCY DETECTION
-- Check for potential MVDs (not FDs)
-- emp_id →→ project_id (employee can work on multiple projects)
SELECT emp_id, 
       COUNT(DISTINCT project_id) as project_count,
       COUNT(DISTINCT CONCAT(dept_id, manager_id, salary)) as other_attr_combinations
FROM employee_info
GROUP BY emp_id;

-- 8. PARTIAL DEPENDENCY DETECTION (for 2NF analysis)
-- In relation with composite key {emp_id, project_id}
-- Check if non-key attributes depend on part of the key

-- emp_name depends only on emp_id (partial dependency)
SELECT project_id, emp_id, COUNT(DISTINCT emp_name) as name_count
FROM employee_info
GROUP BY project_id, emp_id
HAVING COUNT(DISTINCT emp_name) > 1;

-- project_name depends only on project_id (partial dependency)  
SELECT emp_id, project_id, COUNT(DISTINCT project_name) as name_count
FROM employee_info
GROUP BY emp_id, project_id
HAVING COUNT(DISTINCT project_name) > 1;

-- 9. TRANSITIVE DEPENDENCY DETECTION (for 3NF analysis)
-- emp_id → dept_id → dept_name (transitive dependency)
-- emp_id → manager_id → manager_name (transitive dependency)

-- Verify transitive path: emp_id → dept_id → dept_name
WITH emp_dept AS (
    SELECT DISTINCT emp_id, dept_id FROM employee_info
),
dept_name_mapping AS (
    SELECT DISTINCT dept_id, dept_name FROM employee_info  
)
SELECT ed.emp_id, ed.dept_id, dn.dept_name
FROM emp_dept ed
JOIN dept_name_mapping dn ON ed.dept_id = dn.dept_id
ORDER BY ed.emp_id;

-- 10. DEPENDENCY PRESERVATION CHECK
-- Create a function to check if a set of FDs is preserved after decomposition
-- This is a conceptual demonstration

-- Original FDs that should be preserved:
-- 1. emp_id → emp_name, dept_id, salary
-- 2. dept_id → dept_name, manager_id, manager_name
-- 3. manager_id → manager_name  
-- 4. project_id → project_name
-- 5. emp_id, project_id → (composite key constraint)

-- Check preservation by testing each FD on decomposed relations
-- (This would be done after actual decomposition)

-- 11. BCNF VIOLATION DETECTION
-- Find FDs where determinant is not a superkey
-- In our example: dept_id → dept_name violates BCNF if dept_id is not a superkey

-- Check if dept_id is a superkey (it's not in our composite key relation)
SELECT 'dept_id is not a superkey' as bcnf_violation
WHERE EXISTS (
    SELECT dept_id, COUNT(*) 
    FROM employee_info 
    GROUP BY dept_id 
    HAVING COUNT(*) > 1
);

-- 12. ARMSTRONG'S AXIOMS DEMONSTRATION
-- Reflexivity: If Y ⊆ X, then X → Y
-- Example: {emp_id, emp_name} → emp_id
SELECT DISTINCT emp_id, emp_name, emp_id as derived_emp_id
FROM employee_info;

-- Augmentation: If X → Y, then XZ → YZ  
-- Example: If emp_id → emp_name, then {emp_id, dept_id} → {emp_name, dept_id}
SELECT emp_id, dept_id, emp_name, dept_id as derived_dept_id
FROM employee_info
ORDER BY emp_id, dept_id;

-- Transitivity: If X → Y and Y → Z, then X → Z
-- Example: emp_id → dept_id and dept_id → dept_name, so emp_id → dept_name
SELECT DISTINCT e1.emp_id, e1.dept_id, e2.dept_name
FROM employee_info e1
JOIN (SELECT DISTINCT dept_id, dept_name FROM employee_info) e2 
ON e1.dept_id = e2.dept_id
ORDER BY e1.emp_id;`
    },
    {
      title: 'Armstrong\'s Axioms and Closure Computation',
      language: 'java',
      description: 'Java implementation of Armstrong\'s axioms, closure computation, and candidate key finding algorithms',
      code: `import java.util.*;

public class FunctionalDependencyAnalyzer {
    
    // Represents a functional dependency X -> Y
    public static class FunctionalDependency {
        private Set<String> determinant;  // X (left side)
        private Set<String> dependent;    // Y (right side)
        
        public FunctionalDependency(Set<String> determinant, Set<String> dependent) {
            this.determinant = new HashSet<>(determinant);
            this.dependent = new HashSet<>(dependent);
        }
        
        public FunctionalDependency(String det, String dep) {
            this.determinant = Set.of(det);
            this.dependent = Set.of(dep);
        }
        
        public Set<String> getDeterminant() { return determinant; }
        public Set<String> getDependent() { return dependent; }
        
        @Override
        public String toString() {
            return determinant + " -> " + dependent;
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (!(obj instanceof FunctionalDependency)) return false;
            FunctionalDependency fd = (FunctionalDependency) obj;
            return determinant.equals(fd.determinant) && dependent.equals(fd.dependent);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(determinant, dependent);
        }
    }
    
    private Set<String> attributes;
    private Set<FunctionalDependency> functionalDependencies;
    
    public FunctionalDependencyAnalyzer(Set<String> attributes) {
        this.attributes = new HashSet<>(attributes);
        this.functionalDependencies = new HashSet<>();
    }
    
    public void addFunctionalDependency(FunctionalDependency fd) {
        functionalDependencies.add(fd);
    }
    
    public void addFunctionalDependency(String determinant, String dependent) {
        addFunctionalDependency(new FunctionalDependency(determinant, dependent));
    }
    
    // ARMSTRONG'S AXIOMS IMPLEMENTATION
    
    // Reflexivity: If Y ⊆ X, then X -> Y
    public Set<FunctionalDependency> applyReflexivity(Set<String> attributeSet) {
        Set<FunctionalDependency> reflexiveFDs = new HashSet<>();
        
        // Generate all non-empty subsets of attributeSet
        for (String attr : attributeSet) {
            Set<String> subset = Set.of(attr);
            reflexiveFDs.add(new FunctionalDependency(attributeSet, subset));
        }
        
        // Add the trivial FD X -> X
        reflexiveFDs.add(new FunctionalDependency(attributeSet, attributeSet));
        
        return reflexiveFDs;
    }
    
    // Augmentation: If X -> Y, then XZ -> YZ
    public FunctionalDependency applyAugmentation(FunctionalDependency fd, Set<String> augmentSet) {
        Set<String> newDeterminant = new HashSet<>(fd.getDeterminant());
        newDeterminant.addAll(augmentSet);
        
        Set<String> newDependent = new HashSet<>(fd.getDependent());
        newDependent.addAll(augmentSet);
        
        return new FunctionalDependency(newDeterminant, newDependent);
    }
    
    // Transitivity: If X -> Y and Y -> Z, then X -> Z
    public Optional<FunctionalDependency> applyTransitivity(FunctionalDependency fd1, FunctionalDependency fd2) {
        // Check if fd1.dependent equals fd2.determinant
        if (fd1.getDependent().equals(fd2.getDeterminant())) {
            return Optional.of(new FunctionalDependency(fd1.getDeterminant(), fd2.getDependent()));
        }
        return Optional.empty();
    }
    
    // CLOSURE COMPUTATION
    
    // Compute closure of attribute set X (X+)
    public Set<String> computeClosure(Set<String> attributeSet) {
        Set<String> closure = new HashSet<>(attributeSet);
        boolean changed = true;
        
        while (changed) {
            changed = false;
            
            for (FunctionalDependency fd : functionalDependencies) {
                // If determinant is subset of current closure
                if (closure.containsAll(fd.getDeterminant())) {
                    // Add dependent attributes to closure
                    int sizeBefore = closure.size();
                    closure.addAll(fd.getDependent());
                    
                    if (closure.size() > sizeBefore) {
                        changed = true;
                    }
                }
            }
        }
        
        return closure;
    }
    
    // Check if X -> Y is implied by the FD set
    public boolean isImplied(Set<String> determinant, Set<String> dependent) {
        Set<String> closure = computeClosure(determinant);
        return closure.containsAll(dependent);
    }
    
    // CANDIDATE KEY FINDING
    
    // Find all candidate keys
    public Set<Set<String>> findCandidateKeys() {
        Set<Set<String>> candidateKeys = new HashSet<>();
        
        // Generate all possible subsets of attributes
        List<Set<String>> allSubsets = generateSubsets(attributes);
        
        // Sort by size to check smaller sets first
        allSubsets.sort(Comparator.comparing(Set::size));
        
        for (Set<String> subset : allSubsets) {
            if (isSuperkey(subset)) {
                // Check if it's minimal (no proper subset is a superkey)
                if (isMinimal(subset)) {
                    candidateKeys.add(subset);
                }
            }
        }
        
        return candidateKeys;
    }
    
    // Check if attribute set is a superkey
    public boolean isSuperkey(Set<String> attributeSet) {
        Set<String> closure = computeClosure(attributeSet);
        return closure.equals(attributes);
    }
    
    // Check if superkey is minimal (candidate key)
    private boolean isMinimal(Set<String> superkey) {
        for (String attr : superkey) {
            Set<String> subset = new HashSet<>(superkey);
            subset.remove(attr);
            
            if (isSuperkey(subset)) {
                return false; // Found a smaller superkey
            }
        }
        return true;
    }
    
    // CANONICAL COVER COMPUTATION
    
    // Compute canonical cover (minimal equivalent set of FDs)
    public Set<FunctionalDependency> computeCanonicalCover() {
        Set<FunctionalDependency> canonicalCover = new HashSet<>(functionalDependencies);
        
        // Step 1: Make right sides singleton
        canonicalCover = makeSingletonRightSides(canonicalCover);
        
        // Step 2: Remove extraneous attributes from left sides
        canonicalCover = removeExtraneousAttributes(canonicalCover);
        
        // Step 3: Remove redundant FDs
        canonicalCover = removeRedundantFDs(canonicalCover);
        
        return canonicalCover;
    }
    
    private Set<FunctionalDependency> makeSingletonRightSides(Set<FunctionalDependency> fds) {
        Set<FunctionalDependency> result = new HashSet<>();
        
        for (FunctionalDependency fd : fds) {
            for (String attr : fd.getDependent()) {
                result.add(new FunctionalDependency(fd.getDeterminant(), Set.of(attr)));
            }
        }
        
        return result;
    }
    
    private Set<FunctionalDependency> removeExtraneousAttributes(Set<FunctionalDependency> fds) {
        Set<FunctionalDependency> result = new HashSet<>(fds);
        
        for (FunctionalDependency fd : fds) {
            if (fd.getDeterminant().size() > 1) {
                for (String attr : fd.getDeterminant()) {
                    Set<String> reducedDeterminant = new HashSet<>(fd.getDeterminant());
                    reducedDeterminant.remove(attr);
                    
                    // Check if reduced determinant still implies the dependent
                    FunctionalDependency reducedFD = new FunctionalDependency(reducedDeterminant, fd.getDependent());
                    
                    // Temporarily use reduced set to check implication
                    Set<FunctionalDependency> tempFDs = new HashSet<>(result);
                    tempFDs.remove(fd);
                    tempFDs.add(reducedFD);
                    
                    FunctionalDependencyAnalyzer tempAnalyzer = new FunctionalDependencyAnalyzer(attributes);
                    tempFDs.forEach(tempAnalyzer::addFunctionalDependency);
                    
                    if (tempAnalyzer.isImplied(reducedDeterminant, fd.getDependent())) {
                        result.remove(fd);
                        result.add(reducedFD);
                        break;
                    }
                }
            }
        }
        
        return result;
    }
    
    private Set<FunctionalDependency> removeRedundantFDs(Set<FunctionalDependency> fds) {
        Set<FunctionalDependency> result = new HashSet<>(fds);
        
        for (FunctionalDependency fd : fds) {
            Set<FunctionalDependency> tempFDs = new HashSet<>(result);
            tempFDs.remove(fd);
            
            FunctionalDependencyAnalyzer tempAnalyzer = new FunctionalDependencyAnalyzer(attributes);
            tempFDs.forEach(tempAnalyzer::addFunctionalDependency);
            
            if (tempAnalyzer.isImplied(fd.getDeterminant(), fd.getDependent())) {
                result.remove(fd);
            }
        }
        
        return result;
    }
    
    // UTILITY METHODS
    
    private List<Set<String>> generateSubsets(Set<String> set) {
        List<Set<String>> subsets = new ArrayList<>();
        List<String> list = new ArrayList<>(set);
        int n = list.size();
        
        // Generate all 2^n subsets
        for (int i = 1; i < (1 << n); i++) { // Start from 1 to exclude empty set
            Set<String> subset = new HashSet<>();
            for (int j = 0; j < n; j++) {
                if ((i & (1 << j)) != 0) {
                    subset.add(list.get(j));
                }
            }
            subsets.add(subset);
        }
        
        return subsets;
    }
    
    // DEMONSTRATION AND TESTING
    
    public static void main(String[] args) {
        // Example: Employee relation
        // Attributes: {emp_id, emp_name, dept_id, dept_name, manager_id, salary}
        Set<String> attributes = Set.of("emp_id", "emp_name", "dept_id", "dept_name", "manager_id", "salary");
        
        FunctionalDependencyAnalyzer analyzer = new FunctionalDependencyAnalyzer(attributes);
        
        // Add functional dependencies
        analyzer.addFunctionalDependency("emp_id", "emp_name");
        analyzer.addFunctionalDependency("emp_id", "dept_id");
        analyzer.addFunctionalDependency("emp_id", "salary");
        analyzer.addFunctionalDependency("dept_id", "dept_name");
        analyzer.addFunctionalDependency("dept_id", "manager_id");
        
        System.out.println("=== FUNCTIONAL DEPENDENCY ANALYSIS ===");
        System.out.println("Attributes: " + attributes);
        System.out.println("Functional Dependencies:");
        analyzer.functionalDependencies.forEach(System.out::println);
        
        // Test closure computation
        System.out.println("\\n=== CLOSURE COMPUTATION ===");
        Set<String> testSet = Set.of("emp_id");
        Set<String> closure = analyzer.computeClosure(testSet);
        System.out.println("Closure of " + testSet + ": " + closure);
        
        testSet = Set.of("dept_id");
        closure = analyzer.computeClosure(testSet);
        System.out.println("Closure of " + testSet + ": " + closure);
        
        // Find candidate keys
        System.out.println("\\n=== CANDIDATE KEYS ===");
        Set<Set<String>> candidateKeys = analyzer.findCandidateKeys();
        System.out.println("Candidate Keys: " + candidateKeys);
        
        // Test superkey
        System.out.println("\\n=== SUPERKEY TESTING ===");
        System.out.println("Is {emp_id} a superkey? " + analyzer.isSuperkey(Set.of("emp_id")));
        System.out.println("Is {dept_id} a superkey? " + analyzer.isSuperkey(Set.of("dept_id")));
        System.out.println("Is {emp_id, dept_id} a superkey? " + analyzer.isSuperkey(Set.of("emp_id", "dept_id")));
        
        // Compute canonical cover
        System.out.println("\\n=== CANONICAL COVER ===");
        Set<FunctionalDependency> canonicalCover = analyzer.computeCanonicalCover();
        System.out.println("Canonical Cover:");
        canonicalCover.forEach(System.out::println);
        
        // Test Armstrong's axioms
        System.out.println("\\n=== ARMSTRONG'S AXIOMS DEMONSTRATION ===");
        
        // Reflexivity
        Set<FunctionalDependency> reflexive = analyzer.applyReflexivity(Set.of("emp_id", "emp_name"));
        System.out.println("Reflexivity on {emp_id, emp_name}:");
        reflexive.forEach(System.out::println);
        
        // Augmentation
        FunctionalDependency originalFD = new FunctionalDependency("emp_id", "emp_name");
        FunctionalDependency augmentedFD = analyzer.applyAugmentation(originalFD, Set.of("dept_id"));
        System.out.println("\\nAugmentation of " + originalFD + " with {dept_id}: " + augmentedFD);
        
        // Transitivity
        FunctionalDependency fd1 = new FunctionalDependency("emp_id", "dept_id");
        FunctionalDependency fd2 = new FunctionalDependency("dept_id", "dept_name");
        Optional<FunctionalDependency> transitive = analyzer.applyTransitivity(fd1, fd2);
        System.out.println("\\nTransitivity of " + fd1 + " and " + fd2 + ": " + 
                          transitive.map(Object::toString).orElse("Not applicable"));
    }
}`
    },
    {
      title: 'Database Decomposition Algorithms',
      language: 'java',
      description: 'Implementation of lossless join decomposition and dependency preservation algorithms',
      code: `import java.util.*;
import java.util.stream.Collectors;

public class DatabaseDecomposition {
    
    public static class Relation {
        private String name;
        private Set<String> attributes;
        private Set<FunctionalDependencyAnalyzer.FunctionalDependency> functionalDependencies;
        
        public Relation(String name, Set<String> attributes) {
            this.name = name;
            this.attributes = new HashSet<>(attributes);
            this.functionalDependencies = new HashSet<>();
        }
        
        public void addFunctionalDependency(FunctionalDependencyAnalyzer.FunctionalDependency fd) {
            functionalDependencies.add(fd);
        }
        
        public String getName() { return name; }
        public Set<String> getAttributes() { return attributes; }
        public Set<FunctionalDependencyAnalyzer.FunctionalDependency> getFunctionalDependencies() { 
            return functionalDependencies; 
        }
        
        @Override
        public String toString() {
            return name + "(" + String.join(", ", attributes) + ")";
        }
    }
    
    public static class DecompositionResult {
        private List<Relation> relations;
        private boolean isLossless;
        private boolean preservesDependencies;
        
        public DecompositionResult(List<Relation> relations, boolean isLossless, boolean preservesDependencies) {
            this.relations = relations;
            this.isLossless = isLossless;
            this.preservesDependencies = preservesDependencies;
        }
        
        public List<Relation> getRelations() { return relations; }
        public boolean isLossless() { return isLossless; }
        public boolean preservesDependencies() { return preservesDependencies; }
    }
    
    // LOSSLESS JOIN DECOMPOSITION
    
    // Check if decomposition has lossless join property using chase algorithm
    public static boolean isLosslessJoin(Relation originalRelation, List<Relation> decomposition) {
        Set<String> allAttributes = originalRelation.getAttributes();
        Set<FunctionalDependencyAnalyzer.FunctionalDependency> fds = originalRelation.getFunctionalDependencies();
        
        // Create chase tableau
        List<List<String>> tableau = createChaseTableau(allAttributes, decomposition);
        
        // Apply chase algorithm
        boolean changed = true;
        while (changed) {
            changed = false;
            
            for (FunctionalDependencyAnalyzer.FunctionalDependency fd : fds) {
                changed |= applyChaseRule(tableau, fd, allAttributes);
            }
        }
        
        // Check if any row has all original symbols (a1, a2, ..., an)
        return hasCompleteRow(tableau, allAttributes.size());
    }
    
    private static List<List<String>> createChaseTableau(Set<String> attributes, List<Relation> decomposition) {
        List<String> attrList = new ArrayList<>(attributes);
        List<List<String>> tableau = new ArrayList<>();
        
        for (int i = 0; i < decomposition.size(); i++) {
            List<String> row = new ArrayList<>();
            Relation relation = decomposition.get(i);
            
            for (String attr : attrList) {
                if (relation.getAttributes().contains(attr)) {
                    row.add("a" + (attrList.indexOf(attr) + 1)); // Original symbol
                } else {
                    row.add("b" + i + (attrList.indexOf(attr) + 1)); // Subscripted symbol
                }
            }
            tableau.add(row);
        }
        
        return tableau;
    }
    
    private static boolean applyChaseRule(List<List<String>> tableau, 
                                        FunctionalDependencyAnalyzer.FunctionalDependency fd,
                                        Set<String> attributes) {
        List<String> attrList = new ArrayList<>(attributes);
        boolean changed = false;
        
        // Find determinant and dependent column indices
        List<Integer> detCols = fd.getDeterminant().stream()
            .map(attrList::indexOf)
            .collect(Collectors.toList());
        
        List<Integer> depCols = fd.getDependent().stream()
            .map(attrList::indexOf)
            .collect(Collectors.toList());
        
        // Find rows with same values in determinant columns
        for (int i = 0; i < tableau.size(); i++) {
            for (int j = i + 1; j < tableau.size(); j++) {
                if (sameValues(tableau.get(i), tableau.get(j), detCols)) {
                    // Make dependent columns equal (prefer original symbols)
                    changed |= equalizeValues(tableau.get(i), tableau.get(j), depCols);
                }
            }
        }
        
        return changed;
    }
    
    private static boolean sameValues(List<String> row1, List<String> row2, List<Integer> columns) {
        for (int col : columns) {
            if (!row1.get(col).equals(row2.get(col))) {
                return false;
            }
        }
        return true;
    }
    
    private static boolean equalizeValues(List<String> row1, List<String> row2, List<Integer> columns) {
        boolean changed = false;
        
        for (int col : columns) {
            String val1 = row1.get(col);
            String val2 = row2.get(col);
            
            if (!val1.equals(val2)) {
                // Prefer original symbols (a1, a2, ...) over subscripted ones (b...)
                String preferredValue = (val1.startsWith("a") && !val2.startsWith("a")) ? val1 :
                                      (!val1.startsWith("a") && val2.startsWith("a")) ? val2 :
                                      val1.compareTo(val2) < 0 ? val1 : val2;
                
                row1.set(col, preferredValue);
                row2.set(col, preferredValue);
                changed = true;
            }
        }
        
        return changed;
    }
    
    private static boolean hasCompleteRow(List<List<String>> tableau, int numAttributes) {
        for (List<String> row : tableau) {
            boolean isComplete = true;
            for (int i = 0; i < numAttributes; i++) {
                if (!row.get(i).equals("a" + (i + 1))) {
                    isComplete = false;
                    break;
                }
            }
            if (isComplete) {
                return true;
            }
        }
        return false;
    }
    
    // DEPENDENCY PRESERVATION
    
    // Check if decomposition preserves all functional dependencies
    public static boolean preservesDependencies(Relation originalRelation, List<Relation> decomposition) {
        Set<FunctionalDependencyAnalyzer.FunctionalDependency> originalFDs = originalRelation.getFunctionalDependencies();
        
        for (FunctionalDependencyAnalyzer.FunctionalDependency fd : originalFDs) {
            if (!isDependencyPreserved(fd, decomposition)) {
                return false;
            }
        }
        
        return true;
    }
    
    private static boolean isDependencyPreserved(FunctionalDependencyAnalyzer.FunctionalDependency fd, 
                                               List<Relation> decomposition) {
        // Check if FD can be enforced within one of the decomposed relations
        for (Relation relation : decomposition) {
            Set<String> relAttrs = relation.getAttributes();
            if (relAttrs.containsAll(fd.getDeterminant()) && relAttrs.containsAll(fd.getDependent())) {
                return true;
            }
        }
        
        // If not directly preserved, check if it can be derived from preserved FDs
        return canBeDerivied(fd, decomposition);
    }
    
    private static boolean canBeDerivied(FunctionalDependencyAnalyzer.FunctionalDependency targetFD, 
                                       List<Relation> decomposition) {
        // Collect all FDs that are preserved in the decomposition
        Set<FunctionalDependencyAnalyzer.FunctionalDependency> preservedFDs = new HashSet<>();
        
        for (Relation relation : decomposition) {
            for (FunctionalDependencyAnalyzer.FunctionalDependency fd : relation.getFunctionalDependencies()) {
                Set<String> relAttrs = relation.getAttributes();
                if (relAttrs.containsAll(fd.getDeterminant()) && relAttrs.containsAll(fd.getDependent())) {
                    preservedFDs.add(fd);
                }
            }
        }
        
        // Use closure to check if target FD can be derived
        Set<String> allAttributes = decomposition.stream()
            .flatMap(r -> r.getAttributes().stream())
            .collect(Collectors.toSet());
        
        FunctionalDependencyAnalyzer analyzer = new FunctionalDependencyAnalyzer(allAttributes);
        preservedFDs.forEach(analyzer::addFunctionalDependency);
        
        return analyzer.isImplied(targetFD.getDeterminant(), targetFD.getDependent());
    }
    
    // 3NF DECOMPOSITION ALGORITHM
    
    public static DecompositionResult decomposeTo3NF(Relation originalRelation) {
        Set<String> attributes = originalRelation.getAttributes();
        Set<FunctionalDependencyAnalyzer.FunctionalDependency> fds = originalRelation.getFunctionalDependencies();
        
        // Step 1: Compute canonical cover
        FunctionalDependencyAnalyzer analyzer = new FunctionalDependencyAnalyzer(attributes);
        fds.forEach(analyzer::addFunctionalDependency);
        Set<FunctionalDependencyAnalyzer.FunctionalDependency> canonicalCover = analyzer.computeCanonicalCover();
        
        // Step 2: Create relation for each FD in canonical cover
        List<Relation> relations = new ArrayList<>();
        int relationCounter = 1;
        
        for (FunctionalDependencyAnalyzer.FunctionalDependency fd : canonicalCover) {
            Set<String> relationAttrs = new HashSet<>(fd.getDeterminant());
            relationAttrs.addAll(fd.getDependent());
            
            Relation newRelation = new Relation("R" + relationCounter++, relationAttrs);
            newRelation.addFunctionalDependency(fd);
            relations.add(newRelation);
        }
        
        // Step 3: If no relation contains a candidate key, add one
        Set<Set<String>> candidateKeys = analyzer.findCandidateKeys();
        boolean hasKeyRelation = false;
        
        for (Relation relation : relations) {
            for (Set<String> key : candidateKeys) {
                if (relation.getAttributes().containsAll(key)) {
                    hasKeyRelation = true;
                    break;
                }
            }
            if (hasKeyRelation) break;
        }
        
        if (!hasKeyRelation && !candidateKeys.isEmpty()) {
            Set<String> someKey = candidateKeys.iterator().next();
            Relation keyRelation = new Relation("R" + relationCounter++, someKey);
            relations.add(keyRelation);
        }
        
        // Step 4: Remove redundant relations
        relations = removeRedundantRelations(relations);
        
        // Check properties
        boolean isLossless = isLosslessJoin(originalRelation, relations);
        boolean preservesDeps = preservesDependencies(originalRelation, relations);
        
        return new DecompositionResult(relations, isLossless, preservesDeps);
    }
    
    // BCNF DECOMPOSITION ALGORITHM
    
    public static DecompositionResult decomposeToBCNF(Relation originalRelation) {
        List<Relation> relations = new ArrayList<>();
        Queue<Relation> toProcess = new LinkedList<>();
        toProcess.add(originalRelation);
        
        while (!toProcess.isEmpty()) {
            Relation current = toProcess.poll();
            
            // Find BCNF violation
            FunctionalDependencyAnalyzer.FunctionalDependency violatingFD = findBCNFViolation(current);
            
            if (violatingFD == null) {
                // No violation, relation is in BCNF
                relations.add(current);
            } else {
                // Decompose based on violating FD
                Set<String> r1Attrs = new HashSet<>(violatingFD.getDeterminant());
                r1Attrs.addAll(violatingFD.getDependent());
                
                Set<String> r2Attrs = new HashSet<>(current.getAttributes());
                r2Attrs.removeAll(violatingFD.getDependent());
                
                Relation r1 = new Relation(current.getName() + "1", r1Attrs);
                Relation r2 = new Relation(current.getName() + "2", r2Attrs);
                
                // Distribute FDs to new relations
                distributeFDs(current, Arrays.asList(r1, r2));
                
                toProcess.add(r1);
                toProcess.add(r2);
            }
        }
        
        // Check properties (BCNF decomposition may not preserve dependencies)
        boolean isLossless = isLosslessJoin(originalRelation, relations);
        boolean preservesDeps = preservesDependencies(originalRelation, relations);
        
        return new DecompositionResult(relations, isLossless, preservesDeps);
    }
    
    private static FunctionalDependencyAnalyzer.FunctionalDependency findBCNFViolation(Relation relation) {
        Set<String> attributes = relation.getAttributes();
        FunctionalDependencyAnalyzer analyzer = new FunctionalDependencyAnalyzer(attributes);
        relation.getFunctionalDependencies().forEach(analyzer::addFunctionalDependency);
        
        for (FunctionalDependencyAnalyzer.FunctionalDependency fd : relation.getFunctionalDependencies()) {
            // Check if determinant is a superkey
            if (!analyzer.isSuperkey(fd.getDeterminant())) {
                return fd; // BCNF violation found
            }
        }
        
        return null; // No BCNF violation
    }
    
    private static void distributeFDs(Relation original, List<Relation> newRelations) {
        for (FunctionalDependencyAnalyzer.FunctionalDependency fd : original.getFunctionalDependencies()) {
            for (Relation newRelation : newRelations) {
                Set<String> attrs = newRelation.getAttributes();
                if (attrs.containsAll(fd.getDeterminant()) && attrs.containsAll(fd.getDependent())) {
                    newRelation.addFunctionalDependency(fd);
                }
            }
        }
    }
    
    private static List<Relation> removeRedundantRelations(List<Relation> relations) {
        List<Relation> result = new ArrayList<>();
        
        for (Relation relation : relations) {
            boolean isRedundant = false;
            
            for (Relation other : relations) {
                if (relation != other && other.getAttributes().containsAll(relation.getAttributes())) {
                    isRedundant = true;
                    break;
                }
            }
            
            if (!isRedundant) {
                result.add(relation);
            }
        }
        
        return result;
    }
    
    // DEMONSTRATION
    
    public static void main(String[] args) {
        // Example: Employee relation with BCNF violation
        Set<String> attributes = Set.of("emp_id", "emp_name", "dept_id", "dept_name", "manager_id");
        Relation originalRelation = new Relation("Employee", attributes);
        
        // Add functional dependencies
        originalRelation.addFunctionalDependency(
            new FunctionalDependencyAnalyzer.FunctionalDependency("emp_id", "emp_name"));
        originalRelation.addFunctionalDependency(
            new FunctionalDependencyAnalyzer.FunctionalDependency("emp_id", "dept_id"));
        originalRelation.addFunctionalDependency(
            new FunctionalDependencyAnalyzer.FunctionalDependency("dept_id", "dept_name"));
        originalRelation.addFunctionalDependency(
            new FunctionalDependencyAnalyzer.FunctionalDependency("dept_id", "manager_id"));
        
        System.out.println("=== ORIGINAL RELATION ===");
        System.out.println(originalRelation);
        System.out.println("Functional Dependencies:");
        originalRelation.getFunctionalDependencies().forEach(System.out::println);
        
        // 3NF Decomposition
        System.out.println("\\n=== 3NF DECOMPOSITION ===");
        DecompositionResult result3NF = decomposeTo3NF(originalRelation);
        System.out.println("Relations:");
        result3NF.getRelations().forEach(System.out::println);
        System.out.println("Lossless: " + result3NF.isLossless());
        System.out.println("Preserves Dependencies: " + result3NF.preservesDependencies());
        
        // BCNF Decomposition
        System.out.println("\\n=== BCNF DECOMPOSITION ===");
        DecompositionResult resultBCNF = decomposeToBCNF(originalRelation);
        System.out.println("Relations:");
        resultBCNF.getRelations().forEach(System.out::println);
        System.out.println("Lossless: " + resultBCNF.isLossless());
        System.out.println("Preserves Dependencies: " + resultBCNF.preservesDependencies());
    }
}`
    }
  ],

  questions: [
    {
      question: 'What is a functional dependency and how do you identify them in a relation?',
      answer: 'A functional dependency X → Y means that for any two tuples with the same values for attributes in X, they must have the same values for attributes in Y. To identify FDs: 1) Analyze real-world semantics (emp_id → emp_name because each employee has unique ID and name), 2) Examine sample data for patterns, 3) Check business rules and constraints, 4) Test with SQL: SELECT X, COUNT(DISTINCT Y) FROM table GROUP BY X HAVING COUNT(DISTINCT Y) > 1 (empty result means FD holds). Example: In Employee(emp_id, name, dept_id, dept_name), we have emp_id → name, dept_id (each employee has one name and department) and dept_id → dept_name (each department has one name).'
    },
    {
      question: 'Explain Armstrong\'s axioms and how they are used to derive new functional dependencies.',
      answer: 'Armstrong\'s axioms are complete inference rules for FDs: 1) Reflexivity: If Y ⊆ X, then X → Y (trivial FDs), 2) Augmentation: If X → Y, then XZ → YZ (add attributes to both sides), 3) Transitivity: If X → Y and Y → Z, then X → Z (chain dependencies). Additional derived rules: Union (X → Y and X → Z implies X → YZ), Decomposition (X → YZ implies X → Y and X → Z), Pseudotransitivity (X → Y and YZ → W implies XZ → W). Used to: find closure of attribute sets, derive all implied FDs, prove FD equivalence, find candidate keys. Example: Given emp_id → dept_id and dept_id → dept_name, by transitivity emp_id → dept_name.'
    },
    {
      question: 'How do you compute the closure of an attribute set and why is it important?',
      answer: 'Closure X+ is the set of all attributes functionally determined by X. Algorithm: 1) Start with closure = X, 2) For each FD Y → Z, if Y ⊆ closure, add Z to closure, 3) Repeat until no changes. Importance: 1) Find candidate keys (X is superkey if X+ = all attributes), 2) Test FD implication (X → Y holds if Y ⊆ X+), 3) Check equivalence of FD sets, 4) Optimize queries. Example: Given FDs {A → B, B → C, C → D}, closure of {A} = {A,B,C,D}. If relation has attributes {A,B,C,D}, then {A} is a candidate key since A+ contains all attributes.'
    },
    {
      question: 'What is a canonical cover and how do you compute it?',
      answer: 'Canonical cover is a minimal equivalent set of FDs with: 1) Right sides are singletons, 2) No extraneous attributes in left sides, 3) No redundant FDs. Algorithm: 1) Make right sides singleton (X → YZ becomes X → Y, X → Z), 2) Remove extraneous attributes from left sides (if XY → Z and X → Z, remove Y), 3) Remove redundant FDs (if F-{X → Y} implies X → Y, remove it). Benefits: Reduced storage, faster constraint checking, cleaner schema design. Example: {AB → C, A → B, B → C} becomes {A → B, B → C} (AB → C is redundant by transitivity). Canonical cover helps in normalization and dependency preservation during decomposition.'
    },
    {
      question: 'Explain the difference between lossless join and dependency preservation in decomposition.',
      answer: 'Lossless Join: Decomposition doesn\'t lose information - natural join of decomposed relations equals original relation. Tested using chase algorithm or by checking if common attributes form superkey in one relation. Dependency Preservation: All original FDs can be enforced on decomposed relations without joins. Some FDs may be lost if they span multiple relations. Trade-offs: 3NF guarantees both properties, BCNF guarantees lossless join but may lose dependencies. Example: R(A,B,C) with FDs {A → B, B → C} decomposed to R1(A,B), R2(B,C) is lossless (B is key in both) and preserves dependencies. But R1(A,B), R2(A,C) loses dependency B → C.'
    },
    {
      question: 'How do you find all candidate keys of a relation given its functional dependencies?',
      answer: 'Algorithm: 1) Find attributes that never appear on right side of FDs (must be in every key), 2) Find attributes that never appear on left side (never in any key), 3) For remaining attributes, test all combinations starting with essential attributes, 4) Check if closure equals all attributes (superkey test), 5) Verify minimality (no proper subset is superkey). Optimization: Start with smallest sets, use closure computation efficiently. Example: R(A,B,C,D) with FDs {A → B, B → C, C → D}. A never on right (essential), D never on left (not in key). Test {A}: A+ = {A,B,C,D} = all attributes, so {A} is the only candidate key. Multiple keys possible when no single attribute determines all others.'
    },
    {
      question: 'What are the different types of anomalies that functional dependencies can help identify?',
      answer: 'Anomalies caused by poor normalization: 1) Update Anomaly: Changing one fact requires multiple tuple updates (dept_name appears in multiple employee tuples), 2) Insertion Anomaly: Cannot insert certain facts without others (cannot add department without employee), 3) Deletion Anomaly: Deleting tuple loses other information (deleting last employee loses department info). FDs help identify: Partial dependencies (non-key attributes depend on part of composite key) cause 2NF violations, Transitive dependencies (A → B → C) cause 3NF violations, Non-superkey determinants cause BCNF violations. Solution: Normalize using decomposition based on FDs to eliminate anomalies while preserving information and dependencies.'
    },
    {
      question: 'How does the chase algorithm work for testing lossless join decomposition?',
      answer: 'Chase algorithm simulates natural join to test losslessness: 1) Create tableau with one row per relation in decomposition, 2) Use original symbols (a1,a2,...) for attributes in relation, subscripted symbols (bij) for others, 3) Apply FDs as chase rules: if two rows agree on determinant, make dependent attributes equal (prefer original symbols), 4) Repeat until no changes, 5) Decomposition is lossless if any row has all original symbols. Example: R(A,B,C) with FD A → B, decomposed to R1(A,B), R2(A,C). Tableau: [a1,a2,b13], [a1,b22,a3]. Apply A → B: both rows have a1 for A, so make B equal: [a1,a2,a3], [a1,a2,a3]. First row has all original symbols, so lossless.'
    },
    {
      question: 'What is the difference between 3NF and BCNF decomposition algorithms?',
      answer: '3NF Algorithm: 1) Compute canonical cover, 2) Create relation for each FD in cover, 3) Add relation containing candidate key if none exists, 4) Remove redundant relations. Guarantees: Lossless join and dependency preservation. BCNF Algorithm: 1) Find BCNF violation (FD where determinant is not superkey), 2) Decompose using violating FD: R1 = determinant ∪ dependent, R2 = original - dependent, 3) Recursively apply to subrelations. Guarantees: Lossless join but may lose dependencies. Choice: Use 3NF when dependency preservation is critical, BCNF when eliminating all redundancy is priority. 3NF allows some redundancy but preserves all constraints.'
    },
    {
      question: 'How do you handle multivalued dependencies in database design?',
      answer: 'Multivalued Dependencies (MVDs): X →→ Y means X multi-determines Y - for each X value, there\'s a set of associated Y values independent of other attributes. Example: Employee →→ Skills (employee has multiple skills independent of projects). MVDs cause 4NF violations leading to redundancy. Detection: Look for independent multi-valued attributes. Decomposition: Split relation at MVD boundary - R(X,Y,Z) with X →→ Y becomes R1(X,Y), R2(X,Z). Unlike FDs, MVDs require different normalization approach (4NF). Join dependencies generalize MVDs further (5NF). Modern approach: Use separate tables for multi-valued attributes with foreign keys, avoiding MVD issues entirely.'
    },
    {
      question: 'What are the practical considerations when applying decomposition in real database systems?',
      answer: 'Practical considerations: 1) Performance impact: More joins needed, query complexity increases, 2) Application changes: Existing code may need modification, 3) Referential integrity: More foreign key constraints to maintain, 4) Transaction boundaries: ACID properties across multiple tables, 5) Backup/recovery: More complex with multiple relations, 6) Indexing strategy: Need indexes on join columns, 7) Denormalization trade-offs: Sometimes accept redundancy for performance. Best practices: Normalize during design, selectively denormalize for performance, use views to hide complexity, monitor query performance, consider materialized views for complex joins. Balance theoretical correctness with practical performance needs.'
    },
    {
      question: 'How do functional dependencies relate to database constraints and integrity rules?',
      answer: 'FDs are declarative integrity constraints enforced by DBMS: 1) Primary key constraints enforce FD (key → all attributes), 2) Unique constraints create FDs (unique attribute → other attributes), 3) Foreign key constraints create referential FDs, 4) Check constraints can enforce some FDs. Implementation: DBMS uses FDs for query optimization (eliminating redundant joins), constraint checking (preventing violations), index selection (covering indexes for FDs). Modern systems: Constraint-based optimization, automatic index recommendations, materialized view selection based on FDs. FDs bridge logical design (normalization) and physical implementation (constraints, indexes, optimization). Understanding FDs helps write efficient queries and design better schemas.'
    }
  ]
};

