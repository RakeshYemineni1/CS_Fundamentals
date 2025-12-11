export const enhancedQueryProcessingExecution = {
  id: 'query-processing-execution',
  title: 'Query Processing & Execution',
  subtitle: 'Query Optimization and Execution Strategies',
  summary: 'Query processing transforms SQL queries into efficient execution plans through parsing, optimization, and execution phases, using cost-based optimization and various join algorithms.',
  analogy: 'Like planning a road trip - you parse the destination (query), find the best route considering traffic and costs (optimization), then follow the route (execution).',
  visualConcept: 'Picture a query going through phases: parsing into a tree, optimizing for best performance, then executing step-by-step with chosen algorithms.',
  realWorldUse: 'Database management systems, query optimizers, data warehouses, analytics platforms, and any system processing complex SQL queries.',
  explanation: `Query Processing and Execution:

Query processing transforms high-level SQL into efficient execution plans through multiple phases. Parsing validates syntax and builds query trees, optimization chooses the best execution strategy, and execution carries out the plan.

Cost-based optimization estimates execution costs using statistics about data distribution and system resources. Join algorithms like nested loop, hash join, and sort-merge join each have different performance characteristics.

Execution models include iterator-based (pull), materialization (push), and vectorized processing, each suited for different workloads and hardware architectures.`,
  keyPoints: [
    'Query processing has parsing, optimization, and execution phases',
    'Cost-based optimization uses statistics for plan selection',
    'Join algorithms have different performance characteristics',
    'Execution plans show the chosen query strategy',
    'Statistics collection crucial for optimization accuracy',
    'Index usage significantly affects query performance',
    'Parallel execution improves performance on large datasets',
    'Query rewriting can improve execution efficiency',
    'Execution models affect memory usage and throughput',
    'Understanding execution plans helps query tuning'
  ],
  codeExamples: [
    {
      title: "Query Processing Overview",
      content: `
        <h3>Query Processing Phases</h3>
        <p>Query processing transforms high-level SQL queries into efficient execution plans through multiple phases.</p>
        
        <h4>1. Query Parsing</h4>
        <ul>
          <li>Lexical analysis - tokenize SQL text</li>
          <li>Syntax analysis - build parse tree</li>
          <li>Semantic analysis - validate schema references</li>
          <li>Generate initial query tree</li>
        </ul>

        <h4>2. Query Optimization</h4>
        <ul>
          <li>Algebraic optimization - apply transformation rules</li>
          <li>Cost-based optimization - estimate execution costs</li>
          <li>Choose optimal execution plan</li>
          <li>Generate physical operators</li>
        </ul>

        <h4>3. Query Execution</h4>
        <ul>
          <li>Execute physical operators</li>
          <li>Manage memory and I/O resources</li>
          <li>Return results to client</li>
          <li>Handle errors and cleanup</li>
        </ul>

        <div class="code-block">
          <h4>Query Processing Pipeline</h4>
          <pre><code>SQL Query: 
SELECT e.name, d.dept_name 
FROM employee e, department d 
WHERE e.dept_id = d.dept_id AND e.salary > 50000;

Phase 1: Parsing
├── Lexical: [SELECT, e.name, d.dept_name, FROM, ...]
├── Syntax: Parse tree with SELECT, FROM, WHERE clauses
└── Semantic: Validate table/column existence

Phase 2: Optimization  
├── Logical: σ(salary>50000)(employee) ⋈ department
├── Physical: Hash_Join(Index_Scan(employee), Seq_Scan(department))
└── Cost: Estimate I/O, CPU, memory costs

Phase 3: Execution
├── Open operators and initialize
├── Fetch tuples through operator tree  
└── Return results and cleanup</code></pre>
        </div>
      `
    },
    
    {
      title: "Query Execution Plans",
      content: `
        <h3>Execution Plan Components</h3>
        
        <h4>Physical Operators</h4>
        <ul>
          <li><strong>Scan Operators:</strong> Sequential scan, index scan, bitmap scan</li>
          <li><strong>Join Operators:</strong> Nested loop, hash join, sort-merge join</li>
          <li><strong>Sort Operators:</strong> External sort, quicksort, heapsort</li>
          <li><strong>Aggregate Operators:</strong> Hash aggregation, sort aggregation</li>
        </ul>

        <h4>Execution Models</h4>
        
        <h5>1. Iterator Model (Volcano)</h5>
        <ul>
          <li>Each operator implements next() function</li>
          <li>Pull-based execution model</li>
          <li>Good for pipelined execution</li>
          <li>Low memory footprint</li>
        </ul>

        <h5>2. Materialization Model</h5>
        <ul>
          <li>Each operator processes all input at once</li>
          <li>Produces complete output before next operator</li>
          <li>Higher memory usage</li>
          <li>Good for analytical queries</li>
        </ul>

        <h5>3. Vectorized Model</h5>
        <ul>
          <li>Process batches of tuples together</li>
          <li>Better CPU cache utilization</li>
          <li>SIMD instruction optimization</li>
          <li>Balance between iterator and materialization</li>
        </ul>

        <div class="code-block">
          <h4>Execution Plan Example</h4>
          <pre><code>-- Query: SELECT * FROM employee WHERE salary > 50000 ORDER BY name;

Execution Plan:
┌─────────────────┐
│   Sort          │  Cost: 1000
│   (name ASC)    │  Rows: 500
└─────────────────┘
         │
┌─────────────────┐
│   Filter        │  Cost: 800  
│ (salary > 50000)│  Rows: 500
└─────────────────┘
         │
┌─────────────────┐
│  Table Scan     │  Cost: 500
│   (employee)    │  Rows: 2000
└─────────────────┘

Alternative Plan with Index:
┌─────────────────┐
│   Sort          │  Cost: 600
│   (name ASC)    │  Rows: 500  
└─────────────────┘
         │
┌─────────────────┐
│  Index Scan     │  Cost: 300
│ (salary_idx)    │  Rows: 500
└─────────────────┘</code></pre>
        </div>

        <h4>Plan Selection Criteria</h4>
        <ul>
          <li>Total execution cost (I/O + CPU)</li>
          <li>Memory requirements</li>
          <li>Parallelization opportunities</li>
          <li>Resource availability</li>
        </ul>
      `
    },
    
    {
      title: "Cost-Based Optimization",
      content: `
        <h3>Cost Model Components</h3>
        
        <h4>Cost Factors</h4>
        <ul>
          <li><strong>I/O Cost:</strong> Disk page reads and writes</li>
          <li><strong>CPU Cost:</strong> Tuple processing and comparisons</li>
          <li><strong>Memory Cost:</strong> Buffer space requirements</li>
          <li><strong>Network Cost:</strong> Data transfer in distributed systems</li>
        </ul>

        <h4>Statistics Collection</h4>
        <ul>
          <li>Table cardinality (number of tuples)</li>
          <li>Attribute selectivity and distribution</li>
          <li>Index characteristics</li>
          <li>Data clustering and correlation</li>
        </ul>

        <div class="code-block">
          <h4>Cost Estimation Formulas</h4>
          <pre><code>-- Sequential Scan Cost
Cost_SeqScan = Pages_Table × Cost_Page_Read + 
               Tuples_Table × Cost_Tuple_Process

-- Index Scan Cost  
Cost_IndexScan = Height_Index × Cost_Page_Read +
                 Selectivity × Tuples_Table × Cost_Tuple_Process

-- Nested Loop Join Cost
Cost_NLJ = Cost_Outer + 
           Tuples_Outer × Cost_Inner +
           Tuples_Outer × Tuples_Inner × Cost_Join_Process

-- Hash Join Cost
Cost_HashJoin = Cost_Build_Hash + Cost_Probe_Hash +
                (Tuples_Outer + Tuples_Inner) × Cost_Tuple_Process

-- Sort Cost (External Sort)
Cost_Sort = 2 × Pages_Input × Cost_Page_IO × 
            (1 + log_B(Pages_Input / Memory_Pages))</code></pre>
        </div>

        <h4>Selectivity Estimation</h4>
        
        <h5>Equality Predicates:</h5>
        <ul>
          <li>Uniform distribution: 1 / distinct_values</li>
          <li>Histogram-based: frequency from histogram</li>
          <li>Most frequent values: stored frequencies</li>
        </ul>

        <h5>Range Predicates:</h5>
        <ul>
          <li>Uniform: (high - low) / (max - min)</li>
          <li>Histogram: sum of bucket frequencies in range</li>
        </ul>

        <h5>Join Selectivity:</h5>
        <ul>
          <li>Foreign key join: 1 / max(distinct_values)</li>
          <li>General join: 1 / max(distinct_R, distinct_S)</li>
        </ul>

        <div class="code-block">
          <h4>Statistics Example</h4>
          <pre><code>-- Table: employee (10,000 tuples, 1,000 pages)
-- Attribute: salary (min=30000, max=100000, distinct=500)
-- Predicate: salary > 60000

-- Uniform distribution assumption:
Selectivity = (100000 - 60000) / (100000 - 30000) = 0.57
Estimated_Tuples = 10000 × 0.57 = 5700

-- With histogram (salary ranges):
[30000-40000]: 2000 tuples
[40000-50000]: 3000 tuples  
[50000-60000]: 2500 tuples
[60000-70000]: 1500 tuples
[70000-80000]: 800 tuples
[80000-100000]: 200 tuples

Selectivity = (1500 + 800 + 200) / 10000 = 0.25
Estimated_Tuples = 2500</code></pre>
        </div>
      `
    },
    
    {
      title: "Join Algorithms",
      content: `
        <h3>Nested Loop Join</h3>
        
        <h4>Simple Nested Loop Join</h4>
        <p>For each tuple in outer relation, scan entire inner relation.</p>
        
        <div class="code-block">
          <h4>Simple NLJ Algorithm</h4>
          <pre><code>FOR each tuple r IN R DO
  FOR each tuple s IN S DO
    IF r.join_attr = s.join_attr THEN
      OUTPUT (r, s);
    END IF;
  END FOR;
END FOR;

-- Cost: |R| + |R| × |S| page I/Os
-- If R has 1000 pages, S has 500 pages: 1000 + 1000×500 = 501,000 I/Os</code></pre>
        </div>

        <h4>Block Nested Loop Join</h4>
        <p>Read blocks of outer relation to reduce I/O cost.</p>
        
        <div class="code-block">
          <h4>Block NLJ Algorithm</h4>
          <pre><code>FOR each block B_R of R DO
  FOR each block B_S of S DO
    FOR each tuple r IN B_R DO
      FOR each tuple s IN B_S DO
        IF r.join_attr = s.join_attr THEN
          OUTPUT (r, s);
        END IF;
      END FOR;
    END FOR;
  END FOR;
END FOR;

-- Cost: |R| + (|R| / blocks_in_memory) × |S|
-- With 10 buffer pages: 1000 + (1000/9) × 500 = 56,556 I/Os</code></pre>
        </div>

        <h4>Index Nested Loop Join</h4>
        <p>Use index on inner relation's join attribute.</p>
        
        <div class="code-block">
          <h4>Index NLJ Algorithm</h4>
          <pre><code>FOR each tuple r IN R DO
  -- Use index to find matching tuples in S
  matching_tuples = INDEX_LOOKUP(S.index, r.join_attr);
  FOR each tuple s IN matching_tuples DO
    OUTPUT (r, s);
  END FOR;
END FOR;

-- Cost: |R| + |R| × (index_height + selectivity × |S|)
-- With B+ tree (height=3): 1000 + 1000×(3 + 0.1×500) = 51,000 I/Os</code></pre>
        </div>

        <h3>Sort-Merge Join</h3>
        <p>Sort both relations on join attribute, then merge.</p>
        
        <div class="code-block">
          <h4>Sort-Merge Join Algorithm</h4>
          <pre><code>-- Phase 1: Sort both relations
R_sorted = EXTERNAL_SORT(R, join_attr);
S_sorted = EXTERNAL_SORT(S, join_attr);

-- Phase 2: Merge sorted relations
r_ptr = first_tuple(R_sorted);
s_ptr = first_tuple(S_sorted);

WHILE r_ptr ≠ NULL AND s_ptr ≠ NULL DO
  IF r_ptr.join_attr < s_ptr.join_attr THEN
    r_ptr = next_tuple(r_ptr);
  ELSE IF r_ptr.join_attr > s_ptr.join_attr THEN
    s_ptr = next_tuple(s_ptr);
  ELSE
    -- Found match, output all combinations
    OUTPUT_MATCHES(r_ptr, s_ptr);
    ADVANCE_POINTERS();
  END IF;
END WHILE;

-- Cost: Sort_Cost(R) + Sort_Cost(S) + |R| + |S|
-- External sort cost: 2N(1 + log_B(N/M)) where N=pages, M=memory</code></pre>
        </div>

        <h3>Hash Join</h3>
        <p>Build hash table on smaller relation, probe with larger relation.</p>
        
        <div class="code-block">
          <h4>Hash Join Algorithm</h4>
          <pre><code>-- Phase 1: Build hash table on smaller relation (R)
hash_table = CREATE_HASH_TABLE();
FOR each tuple r IN R DO
  bucket = HASH_FUNCTION(r.join_attr);
  INSERT(hash_table[bucket], r);
END FOR;

-- Phase 2: Probe with larger relation (S)  
FOR each tuple s IN S DO
  bucket = HASH_FUNCTION(s.join_attr);
  FOR each tuple r IN hash_table[bucket] DO
    IF r.join_attr = s.join_attr THEN
      OUTPUT (r, s);
    END IF;
  END FOR;
END FOR;

-- Cost: |R| + |S| (if hash table fits in memory)
-- Grace Hash Join for large relations:
-- Cost: 2(|R| + |S|) + |R| + |S| = 3(|R| + |S|)</code></pre>
        </div>

        <h4>Join Algorithm Selection</h4>
        <ul>
          <li><strong>Small relations:</strong> Nested loop join</li>
          <li><strong>One relation much smaller:</strong> Hash join</li>
          <li><strong>Both relations large, sorted:</strong> Sort-merge join</li>
          <li><strong>Index available:</strong> Index nested loop join</li>
          <li><strong>Memory limited:</strong> Grace hash join or external sort-merge</li>
        </ul>
      `
    },
    
    {
      title: "Query Optimization Techniques",
      content: `
        <h3>Algebraic Optimization</h3>
        
        <h4>Selection Pushdown</h4>
        <p>Move selection operations as early as possible to reduce intermediate result sizes.</p>
        
        <div class="code-block">
          <h4>Selection Pushdown Example</h4>
          <pre><code>-- Original query tree:
σ(salary > 50000)(employee ⋈ department)

-- Optimized (push selection down):
σ(salary > 50000)(employee) ⋈ department

-- Further optimization if selection is on department:
employee ⋈ σ(location = 'NY')(department)</code></pre>
        </div>

        <h4>Projection Pushdown</h4>
        <p>Eliminate unnecessary attributes early to reduce data transfer.</p>
        
        <div class="code-block">
          <h4>Projection Pushdown Example</h4>
          <pre><code>-- Original: 
π(name, dept_name)(employee ⋈ department)

-- Optimized:
π(name, dept_name)(π(emp_id, name, dept_id)(employee) ⋈ 
                   π(dept_id, dept_name)(department))</code></pre>
        </div>

        <h4>Join Ordering</h4>
        <p>Choose optimal order for multi-way joins to minimize intermediate results.</p>
        
        <div class="code-block">
          <h4>Join Ordering Example</h4>
          <pre><code>-- Query: R ⋈ S ⋈ T
-- Relations: |R| = 1000, |S| = 100, |T| = 10000
-- Selectivities: R⋈S = 0.01, S⋈T = 0.1, R⋈T = 0.001

-- Left-deep tree 1: ((R ⋈ S) ⋈ T)
Cost = |R| + |S| + |R⋈S| + |T| + |R⋈S⋈T|
     = 1000 + 100 + 10 + 10000 + 1 = 11,111

-- Left-deep tree 2: ((S ⋈ T) ⋈ R)  
Cost = |S| + |T| + |S⋈T| + |R| + |S⋈T⋈R|
     = 100 + 10000 + 1000 + 1000 + 1 = 12,101

-- Optimal: Start with most selective join</code></pre>
        </div>

        <h4>Dynamic Programming for Join Ordering</h4>
        
        <div class="code-block">
          <h4>DP Algorithm for Optimal Join Order</h4>
          <pre><code>FUNCTION OptimalJoinOrder(relations):
  -- Initialize single relations
  FOR each relation R IN relations DO
    cost[{R}] = scan_cost(R);
    plan[{R}] = scan_plan(R);
  END FOR;
  
  -- Build optimal plans for subsets of increasing size
  FOR size = 2 TO |relations| DO
    FOR each subset S of size 'size' DO
      cost[S] = ∞;
      FOR each proper subset S1 of S DO
        S2 = S - S1;
        join_cost = cost[S1] + cost[S2] + join_cost(S1, S2);
        IF join_cost < cost[S] THEN
          cost[S] = join_cost;
          plan[S] = join_plan(plan[S1], plan[S2]);
        END IF;
      END FOR;
    END FOR;
  END FOR;
  
  RETURN plan[relations];</code></pre>
        </div>

        <h4>Heuristic Optimization Rules</h4>
        <ul>
          <li>Perform selections as early as possible</li>
          <li>Perform projections early to reduce tuple width</li>
          <li>Replace Cartesian products with joins when possible</li>
          <li>Perform most selective joins first</li>
          <li>Use indexes when available and beneficial</li>
        </ul>
      `
    }
  ],

  codeExamples: [
    {
      title: "Query Optimizer Implementation",
      language: "java",
      code: `public class QueryOptimizer {
    private Statistics stats;
    private CostModel costModel;
    
    public ExecutionPlan optimize(QueryTree queryTree) {
        // Phase 1: Logical optimization
        QueryTree optimizedTree = applyHeuristics(queryTree);
        
        // Phase 2: Physical optimization
        List<ExecutionPlan> plans = generatePhysicalPlans(optimizedTree);
        
        // Phase 3: Cost-based selection
        return selectBestPlan(plans);
    }
    
    private QueryTree applyHeuristics(QueryTree tree) {
        tree = pushDownSelections(tree);
        tree = pushDownProjections(tree);
        tree = eliminateCartesianProducts(tree);
        return tree;
    }
    
    private QueryTree pushDownSelections(QueryTree tree) {
        if (tree.getOperator() instanceof SelectionOperator) {
            SelectionOperator selection = (SelectionOperator) tree.getOperator();
            QueryTree child = tree.getChild(0);
            
            if (child.getOperator() instanceof JoinOperator) {
                // Try to push selection below join
                Predicate predicate = selection.getPredicate();
                Set<String> referencedTables = predicate.getReferencedTables();
                
                if (referencedTables.size() == 1) {
                    // Selection references only one table, can push down
                    return pushSelectionBelowJoin(selection, child);
                }
            }
        }
        
        // Recursively apply to children
        for (int i = 0; i < tree.getChildCount(); i++) {
            tree.setChild(i, pushDownSelections(tree.getChild(i)));
        }
        
        return tree;
    }
    
    private List<ExecutionPlan> generatePhysicalPlans(QueryTree logicalTree) {
        List<ExecutionPlan> plans = new ArrayList<>();
        
        if (logicalTree.getOperator() instanceof JoinOperator) {
            // Generate different join algorithms
            plans.addAll(generateNestedLoopPlans(logicalTree));
            plans.addAll(generateHashJoinPlans(logicalTree));
            plans.addAll(generateSortMergeJoinPlans(logicalTree));
        } else if (logicalTree.getOperator() instanceof SelectionOperator) {
            // Generate scan plans
            plans.addAll(generateScanPlans(logicalTree));
        }
        
        return plans;
    }
    
    private List<ExecutionPlan> generateHashJoinPlans(QueryTree joinTree) {
        List<ExecutionPlan> plans = new ArrayList<>();
        QueryTree leftChild = joinTree.getChild(0);
        QueryTree rightChild = joinTree.getChild(1);
        
        // Generate plans for children
        List<ExecutionPlan> leftPlans = generatePhysicalPlans(leftChild);
        List<ExecutionPlan> rightPlans = generatePhysicalPlans(rightChild);
        
        // Combine with hash join
        for (ExecutionPlan leftPlan : leftPlans) {
            for (ExecutionPlan rightPlan : rightPlans) {
                // Try both orders (left as build, right as build)
                plans.add(new HashJoinPlan(leftPlan, rightPlan, true));
                plans.add(new HashJoinPlan(rightPlan, leftPlan, false));
            }
        }
        
        return plans;
    }
    
    private ExecutionPlan selectBestPlan(List<ExecutionPlan> plans) {
        ExecutionPlan bestPlan = null;
        double minCost = Double.MAX_VALUE;
        
        for (ExecutionPlan plan : plans) {
            double cost = costModel.estimateCost(plan, stats);
            if (cost < minCost) {
                minCost = cost;
                bestPlan = plan;
            }
        }
        
        return bestPlan;
    }
}

class CostModel {
    private static final double PAGE_READ_COST = 1.0;
    private static final double TUPLE_PROCESS_COST = 0.01;
    private static final double HASH_BUILD_COST = 0.02;
    
    public double estimateCost(ExecutionPlan plan, Statistics stats) {
        if (plan instanceof ScanPlan) {
            return estimateScanCost((ScanPlan) plan, stats);
        } else if (plan instanceof HashJoinPlan) {
            return estimateHashJoinCost((HashJoinPlan) plan, stats);
        }
        // ... other plan types
        return 0.0;
    }
    
    private double estimateScanCost(ScanPlan plan, Statistics stats) {
        TableStatistics tableStats = stats.getTableStats(plan.getTableName());
        
        if (plan.hasIndex() && plan.isIndexSelective()) {
            // Index scan cost
            double indexHeight = Math.log(tableStats.getCardinality()) / Math.log(100);
            double selectivity = estimateSelectivity(plan.getPredicate(), tableStats);
            return indexHeight * PAGE_READ_COST + 
                   selectivity * tableStats.getCardinality() * TUPLE_PROCESS_COST;
        } else {
            // Sequential scan cost
            return tableStats.getPageCount() * PAGE_READ_COST +
                   tableStats.getCardinality() * TUPLE_PROCESS_COST;
        }
    }
    
    private double estimateHashJoinCost(HashJoinPlan plan, Statistics stats) {
        double buildCost = estimateCost(plan.getBuildPlan(), stats);
        double probeCost = estimateCost(plan.getProbePlan(), stats);
        
        long buildCardinality = estimateCardinality(plan.getBuildPlan(), stats);
        long probeCardinality = estimateCardinality(plan.getProbePlan(), stats);
        
        double hashBuildCost = buildCardinality * HASH_BUILD_COST;
        double hashProbeCost = probeCardinality * TUPLE_PROCESS_COST;
        
        return buildCost + probeCost + hashBuildCost + hashProbeCost;
    }
}`
    },
    
    {
      title: "Join Algorithm Implementations",
      language: "python",
      code: `class JoinExecutor:
    def __init__(self, buffer_size=1000):
        self.buffer_size = buffer_size
        
    def nested_loop_join(self, outer_relation, inner_relation, join_predicate):
        """Simple nested loop join implementation"""
        result = []
        
        for outer_tuple in outer_relation:
            for inner_tuple in inner_relation:
                if join_predicate(outer_tuple, inner_tuple):
                    result.append(self.combine_tuples(outer_tuple, inner_tuple))
                    
        return result
    
    def block_nested_loop_join(self, outer_relation, inner_relation, join_predicate):
        """Block nested loop join with buffering"""
        result = []
        outer_blocks = self.create_blocks(outer_relation, self.buffer_size)
        
        for outer_block in outer_blocks:
            # Load entire inner relation for each outer block
            for inner_tuple in inner_relation:
                for outer_tuple in outer_block:
                    if join_predicate(outer_tuple, inner_tuple):
                        result.append(self.combine_tuples(outer_tuple, inner_tuple))
                        
        return result
    
    def hash_join(self, build_relation, probe_relation, join_attribute):
        """Hash join implementation"""
        # Phase 1: Build hash table
        hash_table = {}
        
        for tuple in build_relation:
            key = tuple[join_attribute]
            if key not in hash_table:
                hash_table[key] = []
            hash_table[key].append(tuple)
        
        # Phase 2: Probe hash table
        result = []
        for tuple in probe_relation:
            key = tuple[join_attribute]
            if key in hash_table:
                for matching_tuple in hash_table[key]:
                    result.append(self.combine_tuples(matching_tuple, tuple))
                    
        return result
    
    def grace_hash_join(self, relation1, relation2, join_attribute):
        """Grace hash join for large relations"""
        # Phase 1: Partition both relations
        partitions1 = self.partition_relation(relation1, join_attribute)
        partitions2 = self.partition_relation(relation2, join_attribute)
        
        result = []
        
        # Phase 2: Join corresponding partitions
        for i in range(len(partitions1)):
            if len(partitions1[i]) <= len(partitions2[i]):
                # Build hash table on smaller partition
                partition_result = self.hash_join(
                    partitions1[i], partitions2[i], join_attribute
                )
            else:
                partition_result = self.hash_join(
                    partitions2[i], partitions1[i], join_attribute
                )
            result.extend(partition_result)
            
        return result
    
    def sort_merge_join(self, relation1, relation2, join_attribute):
        """Sort-merge join implementation"""
        # Phase 1: Sort both relations
        sorted_rel1 = sorted(relation1, key=lambda x: x[join_attribute])
        sorted_rel2 = sorted(relation2, key=lambda x: x[join_attribute])
        
        # Phase 2: Merge sorted relations
        result = []
        i, j = 0, 0
        
        while i < len(sorted_rel1) and j < len(sorted_rel2):
            val1 = sorted_rel1[i][join_attribute]
            val2 = sorted_rel2[j][join_attribute]
            
            if val1 < val2:
                i += 1
            elif val1 > val2:
                j += 1
            else:
                # Found matching values, output all combinations
                i_start, j_start = i, j
                
                # Find all tuples with same join value in relation1
                while i < len(sorted_rel1) and sorted_rel1[i][join_attribute] == val1:
                    i += 1
                
                # Find all tuples with same join value in relation2  
                while j < len(sorted_rel2) and sorted_rel2[j][join_attribute] == val2:
                    j += 1
                
                # Output cartesian product of matching groups
                for x in range(i_start, i):
                    for y in range(j_start, j):
                        result.append(self.combine_tuples(sorted_rel1[x], sorted_rel2[y]))
                        
        return result
    
    def partition_relation(self, relation, join_attribute, num_partitions=10):
        """Partition relation using hash function"""
        partitions = [[] for _ in range(num_partitions)]
        
        for tuple in relation:
            key = tuple[join_attribute]
            partition_id = hash(key) % num_partitions
            partitions[partition_id].append(tuple)
            
        return partitions
    
    def create_blocks(self, relation, block_size):
        """Create blocks of specified size from relation"""
        blocks = []
        current_block = []
        
        for tuple in relation:
            current_block.append(tuple)
            if len(current_block) >= block_size:
                blocks.append(current_block)
                current_block = []
                
        if current_block:
            blocks.append(current_block)
            
        return blocks
    
    def combine_tuples(self, tuple1, tuple2):
        """Combine two tuples for join result"""
        return {**tuple1, **tuple2}

# Example usage
if __name__ == "__main__":
    # Sample data
    employees = [
        {'emp_id': 1, 'name': 'Alice', 'dept_id': 10},
        {'emp_id': 2, 'name': 'Bob', 'dept_id': 20},
        {'emp_id': 3, 'name': 'Carol', 'dept_id': 10}
    ]
    
    departments = [
        {'dept_id': 10, 'dept_name': 'Engineering'},
        {'dept_id': 20, 'dept_name': 'Sales'}
    ]
    
    executor = JoinExecutor()
    
    # Hash join example
    result = executor.hash_join(departments, employees, 'dept_id')
    print("Hash Join Result:", result)`
    },
    
    {
      title: "Cost Estimation System",
      language: "sql",
      code: `-- Statistics collection and maintenance

-- Table statistics
CREATE TABLE table_statistics (
    table_name VARCHAR(100),
    cardinality BIGINT,
    page_count INT,
    avg_tuple_size INT,
    last_updated TIMESTAMP
);

-- Column statistics  
CREATE TABLE column_statistics (
    table_name VARCHAR(100),
    column_name VARCHAR(100),
    distinct_values INT,
    null_fraction DECIMAL(5,4),
    min_value VARCHAR(100),
    max_value VARCHAR(100),
    most_common_values TEXT,
    histogram_bounds TEXT
);

-- Index statistics
CREATE TABLE index_statistics (
    index_name VARCHAR(100),
    table_name VARCHAR(100),
    height INT,
    leaf_pages INT,
    distinct_keys INT,
    clustering_factor DECIMAL(5,4)
);

-- Update statistics procedure
DELIMITER //
CREATE PROCEDURE UpdateTableStatistics(IN table_name VARCHAR(100))
BEGIN
    DECLARE tuple_count BIGINT;
    DECLARE page_count INT;
    DECLARE avg_size INT;
    
    -- Get table cardinality
    SET @sql = CONCAT('SELECT COUNT(*) INTO @tuple_count FROM ', table_name);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- Estimate page count (simplified)
    SET page_count = CEILING(@tuple_count / 100); -- Assume 100 tuples per page
    
    -- Update statistics table
    INSERT INTO table_statistics (table_name, cardinality, page_count, last_updated)
    VALUES (table_name, @tuple_count, page_count, NOW())
    ON DUPLICATE KEY UPDATE
        cardinality = @tuple_count,
        page_count = page_count,
        last_updated = NOW();
        
    -- Update column statistics for each column
    CALL UpdateColumnStatistics(table_name);
END //
DELIMITER ;

-- Cost estimation queries
-- Sequential scan cost estimation
SELECT 
    t.table_name,
    t.page_count * 1.0 + t.cardinality * 0.01 as seq_scan_cost
FROM table_statistics t
WHERE t.table_name = 'employee';

-- Index scan cost estimation  
SELECT 
    i.index_name,
    i.height * 1.0 + 
    (c.distinct_values / t.cardinality) * t.cardinality * 0.01 as index_scan_cost
FROM index_statistics i
JOIN table_statistics t ON i.table_name = t.table_name  
JOIN column_statistics c ON i.table_name = c.table_name
WHERE i.index_name = 'idx_employee_salary';

-- Join cost estimation
SELECT 
    t1.table_name as outer_table,
    t2.table_name as inner_table,
    -- Nested loop join cost
    t1.cardinality + t1.cardinality * t2.cardinality * 0.01 as nlj_cost,
    -- Hash join cost (assuming smaller table fits in memory)
    t1.cardinality + t2.cardinality + 
    (t1.cardinality + t2.cardinality) * 0.02 as hash_join_cost,
    -- Sort-merge join cost
    t1.cardinality * LOG2(t1.cardinality) * 0.02 +
    t2.cardinality * LOG2(t2.cardinality) * 0.02 +
    t1.cardinality + t2.cardinality as sort_merge_cost
FROM table_statistics t1, table_statistics t2
WHERE t1.table_name = 'employee' AND t2.table_name = 'department';`
    }
  ],
  resources: [
    { type: 'video', title: 'Query Processing and Optimization', url: 'https://www.youtube.com/results?search_query=database+query+processing+optimization', description: 'Video tutorials on query processing concepts' },
    { type: 'article', title: 'Query Optimization - GeeksforGeeks', url: 'https://www.geeksforgeeks.org/query-optimization-in-dbms/', description: 'Comprehensive guide to query optimization' },
    { type: 'documentation', title: 'PostgreSQL Query Planning', url: 'https://www.postgresql.org/docs/current/planner-optimizer.html', description: 'PostgreSQL query planner documentation' },
    { type: 'article', title: 'SQL Server Execution Plans', url: 'https://docs.microsoft.com/en-us/sql/relational-databases/performance/execution-plans', description: 'Understanding SQL Server execution plans' }
  ],
  questions: [
    {
      question: "Explain the phases of query processing in a database system.",
      answer: "Query processing has three main phases: 1) Parsing - lexical analysis (tokenization), syntax analysis (parse tree), semantic analysis (validation), 2) Optimization - logical optimization (algebraic transformations), physical optimization (access methods, join algorithms), cost-based selection of best plan, 3) Execution - execute physical operators, manage resources, return results. Each phase transforms the query representation toward an efficient executable form."
    },
    
    {
      question: "What is the difference between logical and physical query optimization?",
      answer: "Logical optimization works on relational algebra expressions using transformation rules (selection pushdown, join reordering) that are always beneficial. Physical optimization chooses specific algorithms and access methods (index vs sequential scan, hash vs sort-merge join) based on cost estimates. Logical optimization is rule-based and reduces search space, while physical optimization is cost-based and selects among alternative implementations."
    },
    
    {
      question: "How does cost-based optimization estimate query execution costs?",
      answer: "Cost estimation considers: 1) I/O costs - disk page reads/writes based on table/index sizes, 2) CPU costs - tuple processing and comparisons, 3) Memory costs - buffer requirements, 4) Statistics - table cardinality, attribute selectivity, data distribution, 5) Formulas for each operator type (scan, join, sort). Uses statistics like histograms and most frequent values for accurate selectivity estimation."
    },
    
    {
      question: "Compare the three main join algorithms: nested loop, sort-merge, and hash join.",
      answer: "Nested Loop: O(|R| × |S|) cost, good for small relations or when one has index. Sort-Merge: O(|R|log|R| + |S|log|S|) cost, good when relations already sorted or need sorted output. Hash Join: O(|R| + |S|) cost when smaller relation fits in memory, best for equi-joins with no ordering requirement. Choice depends on relation sizes, available memory, indexes, and whether output needs ordering."
    },
    
    {
      question: "What is selection pushdown and why is it important?",
      answer: "Selection pushdown moves selection operations as early as possible in the query execution plan, ideally before joins. Benefits: 1) Reduces intermediate result sizes, 2) Decreases I/O and memory usage, 3) Improves overall query performance, 4) May enable use of indexes. Example: σ(salary>50000)(Employee ⋈ Department) becomes σ(salary>50000)(Employee) ⋈ Department, filtering employees before the expensive join operation."
    },
    
    {
      question: "How does the query optimizer handle multi-way joins?",
      answer: "Multi-way join optimization considers: 1) Join ordering - use dynamic programming or heuristics to find optimal order, 2) Intermediate result sizes - prefer joins that produce smaller intermediate results, 3) Available indexes - utilize indexes for efficient access, 4) Join algorithms - choose appropriate algorithm for each join, 5) Bushy vs left-deep trees - balance parallelization opportunities with optimization complexity. Goal is minimizing total execution cost."
    },
    
    {
      question: "What are the different execution models and their trade-offs?",
      answer: "Iterator Model (Volcano): Pull-based, low memory, good pipelining, function call overhead. Materialization Model: Process all input at once, higher memory usage, good for analytical queries, no pipelining. Vectorized Model: Process batches, better CPU cache utilization, SIMD optimization, balance between iterator and materialization. Choice depends on query type, available memory, and performance requirements."
    },
    
    {
      question: "How do database systems collect and maintain statistics for cost estimation?",
      answer: "Statistics collection includes: 1) Table statistics - cardinality, page count, tuple size, 2) Column statistics - distinct values, null fraction, min/max values, histograms, 3) Index statistics - height, selectivity, clustering factor, 4) Maintenance - periodic updates, sampling for large tables, incremental updates for frequently changing data. Statistics are crucial for accurate cost estimation and optimal plan selection."
    },
    
    {
      question: "What is the difference between Grace Hash Join and Simple Hash Join?",
      answer: "Simple Hash Join: Build hash table on smaller relation in memory, probe with larger relation. Requires smaller relation to fit in memory. Grace Hash Join: Partition both relations using hash function, join corresponding partitions. Handles cases where neither relation fits in memory. Grace join has additional partitioning phase but can handle larger datasets. Both have O(|R| + |S|) complexity when memory is sufficient."
    },
    
    {
      question: "How does query optimization change in distributed database systems?",
      answer: "Distributed optimization adds complexity: 1) Communication costs - data transfer over network is expensive, 2) Fragment location - consider where data resides, 3) Site capabilities - different processing power at each site, 4) Parallel execution - opportunities for parallelization, 5) Semijoin operations - reduce data transfer, 6) Global vs local optimization - coordinate across sites. Goal is minimizing total cost including network communication."
    }
  ]
};